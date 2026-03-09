import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── GET /api/pilgrimages ─────────────────────────────────────────────────────
export async function listPilgrimages(req: Request, res: Response): Promise<void> {
  const { type, season, active } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};
  if (type)   where.type   = type;
  if (season) where.season = season;
  if (active !== 'all') where.isActive = true;

  try {
    const pilgrimages = await prisma.pilgrimage.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ pilgrimages });
  } catch (err) {
    console.error('List pilgrimages error:', err);
    res.status(500).json({ error: 'Failed to fetch pilgrimages' });
  }
}

// ─── GET /api/pilgrimages/:slug ───────────────────────────────────────────────
export async function getPilgrimage(req: Request, res: Response): Promise<void> {
  try {
    const pilgrimage = await prisma.pilgrimage.findUnique({ where: { slug: req.params.slug } });
    if (!pilgrimage) {
      res.status(404).json({ error: 'Pilgrimage not found' });
      return;
    }
    res.json({ pilgrimage });
  } catch (err) {
    console.error('Get pilgrimage error:', err);
    res.status(500).json({ error: 'Failed to fetch pilgrimage' });
  }
}

// ─── POST /api/pilgrimages ────────────────────────────────────────────────────
export async function createPilgrimage(req: Request, res: Response): Promise<void> {
  const {
    slug, title, type, category, season, year, duration, image, description,
    features, occupancyOptions, priceFromNGN, priceFromUSD, isActive, isFeatured, sortOrder,
  } = req.body;

  if (!slug || !title || !type || !duration || !description || priceFromNGN === undefined) {
    res.status(400).json({ error: 'slug, title, type, duration, description, priceFromNGN are required' });
    return;
  }

  try {
    const pilgrimage = await prisma.pilgrimage.create({
      data: {
        slug,
        title,
        type,
        category:         category || 'Standard',
        season:           season   || null,
        year:             year     ? parseInt(year) : null,
        duration,
        image:            image    || null,
        description,
        features:         features         || [],
        occupancyOptions: occupancyOptions || null,
        priceFromNGN:     parseFloat(priceFromNGN),
        priceFromUSD:     parseFloat(priceFromUSD || 0),
        isActive:         isActive  !== false,
        isFeatured:       isFeatured === true,
        sortOrder:        parseInt(sortOrder || 0),
      },
    });
    res.status(201).json({ message: 'Pilgrimage created', pilgrimage });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'A pilgrimage with this slug already exists' });
      return;
    }
    console.error('Create pilgrimage error:', err);
    res.status(500).json({ error: 'Failed to create pilgrimage' });
  }
}

// ─── PUT /api/pilgrimages/:id ─────────────────────────────────────────────────
export async function updatePilgrimage(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const {
    slug, title, type, category, season, year, duration, image, description,
    features, occupancyOptions, priceFromNGN, priceFromUSD, isActive, isFeatured, sortOrder,
  } = req.body;

  try {
    const pilgrimage = await prisma.pilgrimage.update({
      where: { id },
      data: {
        ...(slug        && { slug }),
        ...(title       && { title }),
        ...(type        && { type }),
        ...(category    && { category }),
        ...(season      !== undefined && { season }),
        ...(year        !== undefined && { year: year ? parseInt(year) : null }),
        ...(duration    && { duration }),
        ...(image       !== undefined && { image }),
        ...(description && { description }),
        ...(features    && { features }),
        ...(occupancyOptions !== undefined && { occupancyOptions }),
        ...(priceFromNGN !== undefined && { priceFromNGN: parseFloat(priceFromNGN) }),
        ...(priceFromUSD !== undefined && { priceFromUSD: parseFloat(priceFromUSD) }),
        ...(isActive    !== undefined && { isActive }),
        ...(isFeatured  !== undefined && { isFeatured }),
        ...(sortOrder   !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });
    res.json({ message: 'Pilgrimage updated', pilgrimage });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Pilgrimage not found' });
      return;
    }
    console.error('Update pilgrimage error:', err);
    res.status(500).json({ error: 'Failed to update pilgrimage' });
  }
}

// ─── DELETE /api/pilgrimages/:id ──────────────────────────────────────────────
export async function deletePilgrimage(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  try {
    await prisma.pilgrimage.delete({ where: { id } });
    res.json({ message: 'Pilgrimage deleted' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Pilgrimage not found' });
      return;
    }
    console.error('Delete pilgrimage error:', err);
    res.status(500).json({ error: 'Failed to delete pilgrimage' });
  }
}