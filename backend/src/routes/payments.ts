import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/payments — record a payment attempt (called from frontend after Lotus Bank)
router.post('/', async (req: Request, res: Response): Promise<void> => {
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
        bookingId: parseInt(bookingId),
        reference,
        amount: parseFloat(amount),
        currency: currency || 'NGN',
        method,
        status: status || 'pending',
        lotusData: lotusData || null,
        isInstallment: isInstallment === true || isInstallment === 'true',
        installmentNumber: installmentNumber ? parseInt(installmentNumber) : null,
        installmentTotal: installmentTotal ? parseInt(installmentTotal) : null,
      },
    });
    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'Payment with this reference already exists' }); return;
    }
    console.error('Record payment error:', err);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// PATCH /api/payments/:reference/status — update payment status (webhook or manual)
router.patch('/:reference/status', async (req: Request, res: Response): Promise<void> => {
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

    // Auto-confirm booking if payment is successful
    if (status === 'success') {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'confirmed' },
      }).catch(() => {});
    }

    res.json({ message: 'Payment status updated', payment });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Payment not found' }); return;
    }
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// GET /api/payments — admin list all payments
router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { status, page = '1', limit = '50' } = req.query as Record<string, string>;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  try {
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          booking: {
            select: {
              bookingRef: true, customerName: true, email: true, service: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    console.error('List payments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

export { router as paymentsRouter };
