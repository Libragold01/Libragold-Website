import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/hotels — public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { country, active } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (country) where.country = country;
  if (active !== 'all') where.isActive = true;

  try {
    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { stars: 'desc' }, { sortOrder: 'asc' }],
    });
    res.json({ hotels });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// GET /api/hotels/:slug — public single
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { slug: req.params.slug } });
    if (!hotel) { res.status(404).json({ error: 'Hotel not found' }); return; }
    res.json({ hotel });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
});

// POST /api/hotels — admin create
router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const {
    slug, name, location, country, stars, image, description,
    amenities, roomTypes, distanceFromHaram, isActive, isFeatured, sortOrder,
  } = req.body;

  if (!slug || !name || !location || !country || !description || !roomTypes) {
    res.status(400).json({ error: 'slug, name, location, country, description, roomTypes are required' });
    return;
  }

  try {
    const hotel = await prisma.hotel.create({
      data: {
        slug, name, location, country, stars: parseInt(stars || 3),
        image: image || null, description, amenities: amenities || [],
        roomTypes, distanceFromHaram: distanceFromHaram || null,
        isActive: isActive !== false, isFeatured: isFeatured === true,
        sortOrder: parseInt(sortOrder || 0),
      },
    });
    res.status(201).json({ message: 'Hotel created', hotel });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2002') {
      res.status(409).json({ error: 'A hotel with this slug already exists' }); return;
    }
    console.error('Create hotel error:', err);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
});

// PUT /api/hotels/:id — admin update
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

  const {
    slug, name, location, country, stars, image, description,
    amenities, roomTypes, distanceFromHaram, isActive, isFeatured, sortOrder,
  } = req.body;

  try {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(location && { location }),
        ...(country && { country }),
        ...(stars !== undefined && { stars: parseInt(stars) }),
        image: image !== undefined ? image : undefined,
        ...(description && { description }),
        ...(amenities && { amenities }),
        ...(roomTypes && { roomTypes }),
        distanceFromHaram: distanceFromHaram !== undefined ? distanceFromHaram : undefined,
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      },
    });
    res.json({ message: 'Hotel updated', hotel });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Hotel not found' }); return; }
    res.status(500).json({ error: 'Failed to update hotel' });
  }
});

// DELETE /api/hotels/:id — admin delete
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
  try {
    await prisma.hotel.delete({ where: { id } });
    res.json({ message: 'Hotel deleted' });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Hotel not found' }); return; }
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

export { router as hotelsRouter };
