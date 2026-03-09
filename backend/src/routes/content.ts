import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/content — get all site content (public)
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    });

    // Also return as a flat key→value map for easy frontend use
    const contentMap: Record<string, string> = {};
    items.forEach((item) => {
      contentMap[item.key] = item.value;
    });

    res.json({ items, contentMap });
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// PUT /api/content/:key — update a content value (protected)
router.put('/:key', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { key } = req.params;
  const { value, section } = req.body;

  if (!value) {
    res.status(400).json({ error: 'value is required' });
    return;
  }

  try {
    const content = await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        section: section || 'general',
      },
    });
    res.json({ message: 'Content updated', content });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export { router as contentRouter };
