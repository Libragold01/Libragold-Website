import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

//GET /api/content 
export async function getContent(_req: Request, res: Response): Promise<void> {
  try {
    const items = await prisma.siteContent.findMany({
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    });

    // Flat key→value map for easy frontend consumption
    const contentMap: Record<string, string> = {};
    items.forEach((item) => {
      contentMap[item.key] = item.value;
    });

    res.json({ items, contentMap });
  } catch (err) {
    console.error('Get content error:', err);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
}

//PUT /api/content/:key 
export async function updateContent(req: Request, res: Response): Promise<void> {
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
}