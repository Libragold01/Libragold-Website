// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/pilgrimages — public listing
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//   const { type, season, active } = req.query as Record<string, string>;
//   const where: Record<string, unknown> = {};
//   if (type) where.type = type;
//   if (season) where.season = season;
//   if (active !== 'all') where.isActive = true;

//   try {
//     const pilgrimages = await prisma.pilgrimage.findMany({
//       where,
//       orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
//     });
//     res.json({ pilgrimages });
//   } catch (err) {
//     console.error('List pilgrimages error:', err);
//     res.status(500).json({ error: 'Failed to fetch pilgrimages' });
//   }
// });

// // GET /api/pilgrimages/:slug — public single
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const pilgrimage = await prisma.pilgrimage.findUnique({ where: { slug: req.params.slug } });
//     if (!pilgrimage) { res.status(404).json({ error: 'Pilgrimage not found' }); return; }
//     res.json({ pilgrimage });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch pilgrimage' });
//   }
// });

// // POST /api/pilgrimages — admin create
// router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const {
//     slug, title, type, category, season, year, duration, image, description,
//     features, occupancyOptions, priceFromNGN, priceFromUSD,
//     isActive, isFeatured, sortOrder,
//   } = req.body;

//   if (!slug || !title || !type || !duration || !description || priceFromNGN === undefined) {
//     res.status(400).json({ error: 'slug, title, type, duration, description, priceFromNGN are required' });
//     return;
//   }

//   try {
//     const pilgrimage = await prisma.pilgrimage.create({
//       data: {
//         slug, title, type, category: category || 'Standard', season: season || null,
//         year: year ? parseInt(year) : null, duration, image: image || null, description,
//         features: features || [], occupancyOptions: occupancyOptions || null,
//         priceFromNGN: parseFloat(priceFromNGN), priceFromUSD: parseFloat(priceFromUSD || 0),
//         isActive: isActive !== false, isFeatured: isFeatured === true,
//         sortOrder: parseInt(sortOrder || 0),
//       },
//     });
//     res.status(201).json({ message: 'Pilgrimage created', pilgrimage });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'A pilgrimage with this slug already exists' });
//       return;
//     }
//     console.error('Create pilgrimage error:', err);
//     res.status(500).json({ error: 'Failed to create pilgrimage' });
//   }
// });

// // PUT /api/pilgrimages/:id — admin update
// router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   const {
//     slug, title, type, category, season, year, duration, image, description,
//     features, occupancyOptions, priceFromNGN, priceFromUSD,
//     isActive, isFeatured, sortOrder,
//   } = req.body;

//   try {
//     const pilgrimage = await prisma.pilgrimage.update({
//       where: { id },
//       data: {
//         ...(slug && { slug }),
//         ...(title && { title }),
//         ...(type && { type }),
//         ...(category && { category }),
//         season: season !== undefined ? season : undefined,
//         year: year !== undefined ? (year ? parseInt(year) : null) : undefined,
//         ...(duration && { duration }),
//         image: image !== undefined ? image : undefined,
//         ...(description && { description }),
//         ...(features && { features }),
//         occupancyOptions: occupancyOptions !== undefined ? occupancyOptions : undefined,
//         ...(priceFromNGN !== undefined && { priceFromNGN: parseFloat(priceFromNGN) }),
//         ...(priceFromUSD !== undefined && { priceFromUSD: parseFloat(priceFromUSD) }),
//         ...(isActive !== undefined && { isActive }),
//         ...(isFeatured !== undefined && { isFeatured }),
//         ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
//       },
//     });
//     res.json({ message: 'Pilgrimage updated', pilgrimage });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Pilgrimage not found' }); return; }
//     res.status(500).json({ error: 'Failed to update pilgrimage' });
//   }
// });

// // DELETE /api/pilgrimages/:id — admin delete
// router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
//   try {
//     await prisma.pilgrimage.delete({ where: { id } });
//     res.json({ message: 'Pilgrimage deleted' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Pilgrimage not found' }); return; }
//     res.status(500).json({ error: 'Failed to delete pilgrimage' });
//   }
// });

// export { router as pilgrimagesRouter };


import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listPilgrimages,
  getPilgrimage,
  createPilgrimage,
  updatePilgrimage,
  deletePilgrimage,
} from '../controllers/pilgrimagesController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Pilgrimages
 *   description: Hajj and Umrah package listings
 */

/**
 * @swagger
 * /api/pilgrimages:
 *   get:
 *     summary: List all pilgrimage packages (public)
 *     tags: [Pilgrimages]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Hajj, Umrah]
 *         description: Filter by type
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *           enum: [Ramadan, December, Monthly, Moulud]
 *         description: Filter by season
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [all]
 *         description: Pass "all" to include inactive packages (admin use)
 *     responses:
 *       200:
 *         description: List of pilgrimage packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pilgrimages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:               { type: integer }
 *                       slug:             { type: string }
 *                       title:            { type: string }
 *                       type:             { type: string, enum: [Hajj, Umrah] }
 *                       category:         { type: string }
 *                       season:           { type: string }
 *                       year:             { type: integer }
 *                       duration:         { type: string }
 *                       description:      { type: string }
 *                       features:         { type: array, items: { type: string } }
 *                       occupancyOptions: { type: object }
 *                       priceFromNGN:     { type: number }
 *                       priceFromUSD:     { type: number }
 *                       isActive:         { type: boolean }
 *                       isFeatured:       { type: boolean }
 *       500:
 *         description: Internal server error
 */
router.get('/', listPilgrimages);

/**
 * @swagger
 * /api/pilgrimages/{slug}:
 *   get:
 *     summary: Get a single pilgrimage package by slug (public)
 *     tags: [Pilgrimages]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: ramadan-umrah-vip-2026
 *     responses:
 *       200:
 *         description: Pilgrimage package details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */
router.get('/:slug', getPilgrimage);

/**
 * @swagger
 * /api/pilgrimages:
 *   post:
 *     summary: Create a new pilgrimage package (protected)
 *     tags: [Pilgrimages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, title, type, duration, description, priceFromNGN]
 *             properties:
 *               slug:             { type: string, example: ramadan-umrah-vip-2026 }
 *               title:            { type: string, example: VIP Umrah Package }
 *               type:             { type: string, enum: [Hajj, Umrah] }
 *               category:         { type: string, example: Premium }
 *               season:           { type: string, example: Ramadan }
 *               year:             { type: integer, example: 2026 }
 *               duration:         { type: string, example: "13-14 Days" }
 *               image:            { type: string }
 *               description:      { type: string }
 *               features:         { type: array, items: { type: string } }
 *               occupancyOptions: { type: object }
 *               priceFromNGN:     { type: number, example: 15000000 }
 *               priceFromUSD:     { type: number, example: 0 }
 *               isActive:         { type: boolean, default: true }
 *               isFeatured:       { type: boolean, default: false }
 *               sortOrder:        { type: integer, default: 0 }
 *     responses:
 *       201:
 *         description: Pilgrimage created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A pilgrimage with this slug already exists
 */
router.post('/', requireAuth, createPilgrimage);

/**
 * @swagger
 * /api/pilgrimages/{id}:
 *   put:
 *     summary: Update a pilgrimage package by ID (protected)
 *     tags: [Pilgrimages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Any subset of pilgrimage fields to update
 *             properties:
 *               slug:             { type: string }
 *               title:            { type: string }
 *               type:             { type: string, enum: [Hajj, Umrah] }
 *               category:         { type: string }
 *               season:           { type: string }
 *               year:             { type: integer }
 *               duration:         { type: string }
 *               image:            { type: string }
 *               description:      { type: string }
 *               features:         { type: array, items: { type: string } }
 *               occupancyOptions: { type: object }
 *               priceFromNGN:     { type: number }
 *               priceFromUSD:     { type: number }
 *               isActive:         { type: boolean }
 *               isFeatured:       { type: boolean }
 *               sortOrder:        { type: integer }
 *     responses:
 *       200:
 *         description: Pilgrimage updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', requireAuth, updatePilgrimage);

/**
 * @swagger
 * /api/pilgrimages/{id}:
 *   delete:
 *     summary: Delete a pilgrimage package by ID (protected)
 *     tags: [Pilgrimages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pilgrimage deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireAuth, deletePilgrimage);

export { router as pilgrimagesRouter };