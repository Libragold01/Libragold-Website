import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── POST /api/payments ───────────────────────────────────────────────────────
export async function recordPayment(req: Request, res: Response): Promise<void> {
  const {
    bookingId, reference, amount, currency, method,
    status, lotusData, isInstallment, installmentNumber, installmentTotal,
  } = req.body;

  if (!bookingId || !reference || amount === undefined || !method) {
    res.status(400).json({ error: 'bookingId, reference, amount, method are required' });
    return;
  }

  try {
    const payment = await prisma.payment.create({
      data: {
        bookingId:         parseInt(bookingId),
        reference,
        amount:            parseFloat(amount),
        currency:          currency || 'NGN',
        method,
        status:            status || 'pending',
        lotusData:         lotusData || null,
        isInstallment:     isInstallment === true || isInstallment === 'true',
        installmentNumber: installmentNumber ? parseInt(installmentNumber) : null,
        installmentTotal:  installmentTotal  ? parseInt(installmentTotal)  : null,
      },
    });
    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Payment with this reference already exists' });
      return;
    }
    console.error('Record payment error:', err);
    res.status(500).json({ error: 'Failed to record payment' });
  }
}

// ─── PATCH /api/payments/:reference/status ────────────────────────────────────
// Called by Lotus Bank webhook OR manually by admin
export async function updatePaymentStatus(req: Request, res: Response): Promise<void> {
  const { status, lotusData } = req.body;
  const validStatuses = ['pending', 'success', 'failed'];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'status must be pending, success, or failed' });
    return;
  }

  try {
    const payment = await prisma.payment.update({
      where: { reference: req.params.reference },
      data: {
        status,
        ...(lotusData && { lotusData }),
      },
    });

    // Auto-confirm the linked booking when payment succeeds — non-critical
    if (status === 'success') {
      await prisma.booking
        .update({
          where: { id: payment.bookingId },
          data: { status: 'confirmed' },
        })
        .catch(() => {});
    }

    res.json({ message: 'Payment status updated', payment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }
    console.error('Update payment status error:', err);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
}

// ─── POST /api/payments/webhook ───────────────────────────────────────────────
// Called by Lotus Bank when a payment is confirmed or failed
export async function lotusWebhook(req: Request, res: Response): Promise<void> {
  try {
    // Log the full payload so we can verify the format
    console.log('[Lotus Webhook] Received payload:', JSON.stringify(req.body, null, 2));

    // Lotus Bank sends either a flat object or { event, data: { ... } }
    const payload = req.body?.data ?? req.body;
    const reference: string | undefined = payload?.reference;
    const rawStatus: string | undefined =
      payload?.status ?? (req.body?.event === 'charge.success' ? 'success' : undefined);

    if (!reference) {
      console.warn('[Lotus Webhook] Missing reference in payload');
      res.status(400).json({ error: 'Missing payment reference' });
      return;
    }

    // Map Lotus status values to our internal statuses
    const statusMap: Record<string, string> = {
      success:   'success',
      successful: 'success',
      completed:  'success',
      failed:     'failed',
      failure:    'failed',
    };
    const internalStatus = statusMap[(rawStatus ?? '').toLowerCase()];

    if (!internalStatus) {
      // Unknown status — acknowledge but don't update
      console.warn(`[Lotus Webhook] Unrecognised status "${rawStatus}" for ref ${reference}`);
      res.json({ received: true, action: 'ignored' });
      return;
    }

    // Update payment and (if success) auto-confirm the booking
    const payment = await prisma.payment.update({
      where: { reference },
      data: {
        status:    internalStatus,
        lotusData: req.body,
      },
    });

    if (internalStatus === 'success') {
      await prisma.booking
        .update({
          where: { id: payment.bookingId },
          data:  { status: 'confirmed' },
        })
        .catch(() => {});
    }

    console.log(`[Lotus Webhook] Payment ${reference} → ${internalStatus}`);
    res.json({ received: true, status: internalStatus });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      // Payment not in DB yet — could be a timing issue, acknowledge anyway
      console.warn('[Lotus Webhook] Payment record not found for reference in payload');
      res.json({ received: true, action: 'not_found' });
      return;
    }
    console.error('[Lotus Webhook] Error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// ─── GET /api/payments ────────────────────────────────────────────────────────
export async function listPayments(req: Request, res: Response): Promise<void> {
  const { status, page = '1', limit = '50' } = req.query as Record<string, string>;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  try {
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              bookingRef:   true,
              customerName: true,
              email:        true,
              service:      true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page:  pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List payments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
}