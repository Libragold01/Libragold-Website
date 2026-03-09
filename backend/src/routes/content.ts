// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/content — get all site content (public)
// router.get('/', async (_req: Request, res: Response): Promise<void> => {
//   try {
//     const items = await prisma.siteContent.findMany({
//       orderBy: [{ section: 'asc' }, { key: 'asc' }],
//     });

//     // Also return as a flat key→value map for easy frontend use
//     const contentMap: Record<string, string> = {};
//     items.forEach((item) => {
//       contentMap[item.key] = item.value;
//     });

//     res.json({ items, contentMap });
//   } catch (err) {
//     console.error('Get content error:', err);
//     res.status(500).json({ error: 'Failed to fetch content' });
//   }
// });

// // PUT /api/content/:key — update a content value (protected)
// router.put('/:key', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const { key } = req.params;
//   const { value, section } = req.body;

//   if (!value) {
//     res.status(400).json({ error: 'value is required' });
//     return;
//   }

//   try {
//     const content = await prisma.siteContent.upsert({
//       where: { key },
//       update: { value },
//       create: {
//         key,
//         value,
//         section: section || 'general',
//       },
//     });
//     res.json({ message: 'Content updated', content });
//   } catch (err) {
//     console.error('Update content error:', err);
//     res.status(500).json({ error: 'Failed to update content' });
//   }
// });

// export { router as contentRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getContent, updateContent } from '../controllers/contentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Site content management (CMS)
 */

/**
 * @swagger
 * /api/content:
 *   get:
 *     summary: Get all site content (public)
 *     tags: [Content]
 *     responses:
 *       200:
 *         description: All site content items and a flat key-value map
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:        { type: integer }
 *                       key:       { type: string, example: hero_title }
 *                       value:     { type: string, example: Your Trusted Travel Partner }
 *                       section:   { type: string, example: hero }
 *                       updatedAt: { type: string, format: date-time }
 *                 contentMap:
 *                   type: object
 *                   additionalProperties:
 *                     type: string
 *                   description: Flat key→value map for easy frontend use
 *                   example:
 *                     hero_title: Your Trusted Travel Partner
 *                     contact_email: info@libragoldgroup.com
 *       500:
 *         description: Internal server error
 */
router.get('/', getContent);

/**
 * @swagger
 * /api/content/{key}:
 *   put:
 *     summary: Create or update a content item by key (protected)
 *     tags: [Content]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Content key (e.g. hero_title, contact_email)
 *         example: hero_title
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: string
 *                 example: Your Trusted Travel Partner
 *               section:
 *                 type: string
 *                 example: hero
 *                 description: Required only when creating a new key
 *     responses:
 *       200:
 *         description: Content updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 content:
 *                   type: object
 *                   properties:
 *                     id:        { type: integer }
 *                     key:       { type: string }
 *                     value:     { type: string }
 *                     section:   { type: string }
 *                     updatedAt: { type: string, format: date-time }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Internal server error
 */
router.put('/:key', requireAuth, updateContent);

export { router as contentRouter };