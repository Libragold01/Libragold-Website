import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── GET /api/tours ───────────────────────────────────────────────────────────
export async function listTours(req: Request, res: Response): Promise<void> {
  const { category, active } = req.query as Record<string, string>;

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (active !== 'all') where.isActive = true;

  try {
    const tours = await prisma.tour.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    res.json({ tours });
  } catch (err) {
    console.error('List tours error:', err);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
}

// ─── GET /api/tours/:slug ─────────────────────────────────────────────────────
export async function getTour(req: Request, res: Response): Promise<void> {
  try {
    const tour = await prisma.tour.findUnique({ where: { slug: req.params.slug } });
    if (!tour) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }
    res.json({ tour });
  } catch (err) {
    console.error('Get tour error:', err);
    res.status(500).json({ error: 'Failed to fetch tour' });
  }
}

// ─── POST /api/tours ──────────────────────────────────────────────────────────
export async function createTour(req: Request, res: Response): Promise<void> {
  const {
    slug, title, destination, country, category, duration, image, description,
    highlights, includes, priceUSD, priceNGN, departureDate,
    maxGroupSize, requiresVisa, isActive, isFeatured, sortOrder,
  } = req.body;

  if (!slug || !title || !destination || !country || !duration || !description || priceNGN === undefined) {
    res.status(400).json({ error: 'slug, title, destination, country, duration, description, priceNGN are required' });
    return;
  }

  try {
    const tour = await prisma.tour.create({
      data: {
        slug,
        title,
        destination,
        country,
        category:      category  || 'Africa',
        duration,
        image:         image     || null,
        description,
        highlights:    highlights || [],
        includes:      includes   || [],
        priceUSD:      parseFloat(priceUSD || 0),
        priceNGN:      parseFloat(priceNGN),
        departureDate: departureDate ? new Date(departureDate) : null,
        maxGroupSize:  parseInt(maxGroupSize || 20),
        requiresVisa:  requiresVisa === true || requiresVisa === 'true',
        isActive:      isActive  !== false,
        isFeatured:    isFeatured === true,
        sortOrder:     parseInt(sortOrder || 0),
      },
    });
    res.status(201).json({ message: 'Tour created', tour });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'A tour with this slug already exists' });
      return;
    }
    console.error('Create tour error:', err);
    res.status(500).json({ error: 'Failed to create tour' });
  }
}

// ─── PUT /api/tours/:id ───────────────────────────────────────────────────────
export async function updateTour(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  const {
    slug, title, destination, country, category, duration, image, description,
    highlights, includes, priceUSD, priceNGN, departureDate,
    maxGroupSize, requiresVisa, isActive, isFeatured, sortOrder,
  } = req.body;

  try {
    const tour = await prisma.tour.update({
      where: { id },
      data: {
        ...(slug        && { slug }),
        ...(title       && { title }),
        ...(destination && { destination }),
        ...(country     && { country }),
        ...(category    && { category }),
        ...(duration    && { duration }),
        ...(image       !== undefined && { image }),
        ...(description && { description }),
        ...(highlights  && { highlights }),
        ...(includes    && { includes }),
        ...(priceUSD    !== undefined && { priceUSD: parseFloat(priceUSD) }),
        ...(priceNGN    !== undefined && { priceNGN: parseFloat(priceNGN) }),
        ...(departureDate !== undefined && { departureDate: departureDate ? new Date(departureDate) : null }),
        ...(maxGroupSize  !== undefined && { maxGroupSize: parseInt(maxGroupSize) }),
        ...(requiresVisa  !== undefined && { requiresVisa: requiresVisa === true || requiresVisa === 'true' }),
        ...(isActive      !== undefined && { isActive }),
        ...(isFeatured    !== undefined && { isFeatured }),
        ...(sortOrder     !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });
    res.json({ message: 'Tour updated', tour });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }
    console.error('Update tour error:', err);
    res.status(500).json({ error: 'Failed to update tour' });
  }
}

// ─── DELETE /api/tours/:id ────────────────────────────────────────────────────
export async function deleteTour(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  try {
    await prisma.tour.delete({ where: { id } });
    res.json({ message: 'Tour deleted' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }
    console.error('Delete tour error:', err);
    res.status(500).json({ error: 'Failed to delete tour' });
  }
}