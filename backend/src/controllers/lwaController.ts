import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendLWAWelcomeEmail } from '../utils/email';
import { notifyLWAViaTermii } from '../utils/termii';

const prisma = new PrismaClient();

// ─── Helper: generate next sequential LWA code ────────────────────────────────
// Uses a transaction to avoid race conditions when multiple registrations
// happen at the same time — ensures no two ambassadors get the same code
async function getNextLWACode(): Promise<{ code: string; number: number }> {
  return prisma.$transaction(async (tx) => {
    const lastEntry = await tx.lWARegistration.findFirst({
      orderBy: { codeNumber: 'desc' },
      select: { codeNumber: true },
    });
    const nextNumber = (lastEntry?.codeNumber ?? 0) + 1;
    const code = 'LWA' + String(nextNumber).padStart(2, '0');
    return { code, number: nextNumber };
  });
}

// ─── POST /api/lwa/register ───────────────────────────────────────────────────
export async function registerAmbassador(req: Request, res: Response): Promise<void> {
  const { fullName, email, phone, city, occupation, socialMedia, howHeard } = req.body;

  if (!fullName || !email || !phone || !city || !occupation || !howHeard) {
    res.status(400).json({
      error: 'fullName, email, phone, city, occupation, and howHeard are required',
    });
    return;
  }

  // Check for duplicate email before trying to create
  const existing = await prisma.lWARegistration.findFirst({ where: { email } });
  if (existing) {
    res.status(409).json({
      error: 'An ambassador with this email address already exists',
      lwaCode: existing.lwaCode,
    });
    return;
  }

  try {
    const { code, number } = await getNextLWACode();

    const ambassador = await prisma.lWARegistration.create({
      data: {
        lwaCode:    code,
        codeNumber: number,
        fullName,
        email,
        phone,
        city,
        occupation,
        socialMedia: socialMedia || null,
        howHeard,
        status: 'active',
      },
    });

    // Send welcome email — non-blocking
    sendLWAWelcomeEmail(ambassador).catch((err) => {
      console.error('LWA email send failed:', err);
    });

    // Send SMS via Termii — non-blocking
    notifyLWAViaTermii({
      fullName:  ambassador.fullName,
      email:     ambassador.email,
      phone:     ambassador.phone,
      lwaCode:   ambassador.lwaCode,
    }).catch(() => {});

    res.status(201).json({
      message: 'Ambassador registered successfully',
      ambassador: {
        id:        ambassador.id,
        lwaCode:   ambassador.lwaCode,
        fullName:  ambassador.fullName,
        status:    ambassador.status,
        createdAt: ambassador.createdAt,
      },
    });
  } catch (err) {
    console.error('LWA register error:', err);
    res.status(500).json({ error: 'Failed to register ambassador' });
  }
}

// ─── GET /api/lwa ─────────────────────────────────────────────────────────────
export async function listAmbassadors(req: Request, res: Response): Promise<void> {
  const { status, search, page = '1', limit = '50' } = req.query as Record<string, string>;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email:    { contains: search, mode: 'insensitive' } },
      { lwaCode:  { contains: search, mode: 'insensitive' } },
      { phone:    { contains: search } },
      { city:     { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const [ambassadors, total] = await Promise.all([
      prisma.lWARegistration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.lWARegistration.count({ where }),
    ]);

    res.json({
      ambassadors,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List LWA error:', err);
    res.status(500).json({ error: 'Failed to fetch ambassadors' });
  }
}

// ─── PATCH /api/lwa/:id/status 
export async function updateAmbassadorStatus(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ambassador ID' });
    return;
  }

  const { status } = req.body;
  const validStatuses = ['active', 'suspended'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: 'status must be either "active" or "suspended"' });
    return;
  }

  try {
    const ambassador = await prisma.lWARegistration.update({
      where: { id },
      data: { status },
    });
    res.json({ message: `Ambassador ${status}`, ambassador });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Ambassador not found' });
      return;
    }
    console.error('Update LWA status error:', err);
    res.status(500).json({ error: 'Failed to update ambassador status' });
  }
}