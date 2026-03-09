import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/visa-packages — public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { active } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (active !== 'all') where.isActive = true;

  try {
    const packages = await prisma.visaPackage.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { country: 'asc' }],
    });
    res.json({ packages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch visa packages' });
  }
});

// GET /api/visa-packages/:slug — public single
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const pkg = await prisma.visaPackage.findUnique({ where: { slug: req.params.slug } });
    if (!pkg) { res.status(404).json({ error: 'Visa package not found' }); return; }
    res.json({ package: pkg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch visa package' });
  }
});

// POST /api/visa-packages — admin create
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const {
    slug, name, country, flag, priceUSD, priceNGN,
    processingTime, validity, requirements, description,
    isActive, isFeatured, sortOrder,
  } = req.body;

  if (!slug || !name || !country || priceNGN === undefined || !processingTime || !description) {
    res.status(400).json({ error: 'slug, name, country, priceNGN, processingTime, description are required' });
    return;
  }

  try {
    const pkg = await prisma.visaPackage.create({
      data: {
        slug, name, country, flag: flag || null,
        priceUSD: parseFloat(priceUSD || 0), priceNGN: parseFloat(priceNGN),
        processingTime, validity: validity || null,
        requirements: requirements || [], description,
        isActive: isActive !== false, isFeatured: isFeatured === true,
        sortOrder: parseInt(sortOrder || 0),
      },
    });
    res.status(201).json({ message: 'Visa package created', package: pkg });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'A visa package with this slug already exists' }); return;
    }
    console.error('Create visa package error:', err);
    res.status(500).json({ error: 'Failed to create visa package' });
  }
});

// PUT /api/visa-packages/:id — admin update
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

  const {
    slug, name, country, flag, priceUSD, priceNGN,
    processingTime, validity, requirements, description,
    isActive, isFeatured, sortOrder,
  } = req.body;

  try {
    const pkg = await prisma.visaPackage.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(country && { country }),
        flag: flag !== undefined ? flag : undefined,
        ...(priceUSD !== undefined && { priceUSD: parseFloat(priceUSD) }),
        ...(priceNGN !== undefined && { priceNGN: parseFloat(priceNGN) }),
        ...(processingTime && { processingTime }),
        validity: validity !== undefined ? validity : undefined,
        ...(requirements && { requirements }),
        ...(description && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });
    res.json({ message: 'Visa package updated', package: pkg });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Visa package not found' }); return; }
    res.status(500).json({ error: 'Failed to update visa package' });
  }
});

// DELETE /api/visa-packages/:id — admin delete
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
  try {
    await prisma.visaPackage.delete({ where: { id } });
    res.json({ message: 'Visa package deleted' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Visa package not found' }); return; }
    res.status(500).json({ error: 'Failed to delete visa package' });
  }
});

export { router as visaPackagesRouter };
