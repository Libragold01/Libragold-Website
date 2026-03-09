// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/tours — public
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//   const { category, active } = req.query as Record<string, string>;
//   const where: Record<string, unknown> = {};
//   if (category) where.category = category;
//   if (active !== 'all') where.isActive = true;

//   try {
//     const tours = await prisma.tour.findMany({
//       where,
//       orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
//     });
//     res.json({ tours });
//   } catch (err) {
//     console.error('List tours error:', err);
//     res.status(500).json({ error: 'Failed to fetch tours' });
//   }
// });

// // GET /api/tours/:slug — public single
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const tour = await prisma.tour.findUnique({ where: { slug: req.params.slug } });
//     if (!tour) { res.status(404).json({ error: 'Tour not found' }); return; }
//     res.json({ tour });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch tour' });
//   }
// });

// // POST /api/tours — admin create
// router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const {
//     slug, title, destination, country, category, duration, image, description,
//     highlights, includes, priceUSD, priceNGN, departureDate,
//     maxGroupSize, requiresVisa, isActive, isFeatured, sortOrder,
//   } = req.body;

//   if (!slug || !title || !destination || !country || !duration || !description || priceNGN === undefined) {
//     res.status(400).json({ error: 'slug, title, destination, country, duration, description, priceNGN are required' });
//     return;
//   }

//   try {
//     const tour = await prisma.tour.create({
//       data: {
//         slug, title, destination, country, category: category || 'Africa',
//         duration, image: image || null, description,
//         highlights: highlights || [], includes: includes || [],
//         priceUSD: parseFloat(priceUSD || 0), priceNGN: parseFloat(priceNGN),
//         departureDate: departureDate ? new Date(departureDate) : null,
//         maxGroupSize: parseInt(maxGroupSize || 20),
//         requiresVisa: requiresVisa === true || requiresVisa === 'true',
//         isActive: isActive !== false, isFeatured: isFeatured === true,
//         sortOrder: parseInt(sortOrder || 0),
//       },
//     });
//     res.status(201).json({ message: 'Tour created', tour });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'A tour with this slug already exists' });
//       return;
//     }
//     console.error('Create tour error:', err);
//     res.status(500).json({ error: 'Failed to create tour' });
//   }
// });

// // PUT /api/tours/:id — admin update
// router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   const {
//     slug, title, destination, country, category, duration, image, description,
//     highlights, includes, priceUSD, priceNGN, departureDate,
//     maxGroupSize, requiresVisa, isActive, isFeatured, sortOrder,
//   } = req.body;

//   try {
//     const tour = await prisma.tour.update({
//       where: { id },
//       data: {
//         ...(slug && { slug }),
//         ...(title && { title }),
//         ...(destination && { destination }),
//         ...(country && { country }),
//         ...(category && { category }),
//         ...(duration && { duration }),
//         image: image !== undefined ? image : undefined,
//         ...(description && { description }),
//         ...(highlights && { highlights }),
//         ...(includes && { includes }),
//         ...(priceUSD !== undefined && { priceUSD: parseFloat(priceUSD) }),
//         ...(priceNGN !== undefined && { priceNGN: parseFloat(priceNGN) }),
//         departureDate: departureDate !== undefined ? (departureDate ? new Date(departureDate) : null) : undefined,
//         ...(maxGroupSize !== undefined && { maxGroupSize: parseInt(maxGroupSize) }),
//         ...(requiresVisa !== undefined && { requiresVisa: requiresVisa === true || requiresVisa === 'true' }),
//         ...(isActive !== undefined && { isActive }),
//         ...(isFeatured !== undefined && { isFeatured }),
//         ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
//       },
//     });
//     res.json({ message: 'Tour updated', tour });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Tour not found' }); return; }
//     res.status(500).json({ error: 'Failed to update tour' });
//   }
// });

// // DELETE /api/tours/:id — admin delete
// router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
//   try {
//     await prisma.tour.delete({ where: { id } });
//     res.json({ message: 'Tour deleted' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Tour not found' }); return; }
//     res.status(500).json({ error: 'Failed to delete tour' });
//   }
// });

// export { router as toursRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/toursController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: International tour packages
 */

/**
 * @swagger
 * /api/tours:
 *   get:
 *     summary: List all tour packages (public)
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Africa, Europe, Asia, Middle East, Americas]
 *         description: Filter by destination category
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [all]
 *         description: Pass "all" to include inactive tours (admin use)
 *     responses:
 *       200:
 *         description: List of tour packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tours:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:            { type: integer }
 *                       slug:          { type: string }
 *                       title:         { type: string }
 *                       destination:   { type: string }
 *                       country:       { type: string }
 *                       category:      { type: string }
 *                       duration:      { type: string }
 *                       description:   { type: string }
 *                       highlights:    { type: array, items: { type: string } }
 *                       includes:      { type: array, items: { type: string } }
 *                       priceUSD:      { type: number }
 *                       priceNGN:      { type: number }
 *                       departureDate: { type: string, format: date-time }
 *                       maxGroupSize:  { type: integer }
 *                       requiresVisa:  { type: boolean }
 *                       isActive:      { type: boolean }
 *                       isFeatured:    { type: boolean }
 *       500:
 *         description: Internal server error
 */
router.get('/', listTours);

/**
 * @swagger
 * /api/tours/{slug}:
 *   get:
 *     summary: Get a single tour by slug (public)
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: egypt-explorer
 *     responses:
 *       200:
 *         description: Tour details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */
router.get('/:slug', getTour);

/**
 * @swagger
 * /api/tours:
 *   post:
 *     summary: Create a new tour package (protected)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, title, destination, country, duration, description, priceNGN]
 *             properties:
 *               slug:          { type: string, example: egypt-explorer }
 *               title:         { type: string, example: Egypt Explorer }
 *               destination:   { type: string, example: "Cairo, Luxor, Aswan" }
 *               country:       { type: string, example: Egypt }
 *               category:      { type: string, enum: [Africa, Europe, Asia, Middle East, Americas], default: Africa }
 *               duration:      { type: string, example: "7 Days" }
 *               image:         { type: string }
 *               description:   { type: string }
 *               highlights:    { type: array, items: { type: string } }
 *               includes:      { type: array, items: { type: string } }
 *               priceUSD:      { type: number, example: 1200 }
 *               priceNGN:      { type: number, example: 1800000 }
 *               departureDate: { type: string, format: date-time }
 *               maxGroupSize:  { type: integer, default: 20 }
 *               requiresVisa:  { type: boolean, default: false }
 *               isActive:      { type: boolean, default: true }
 *               isFeatured:    { type: boolean, default: false }
 *               sortOrder:     { type: integer, default: 0 }
 *     responses:
 *       201:
 *         description: Tour created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A tour with this slug already exists
 */
router.post('/', requireAuth, createTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   put:
 *     summary: Update a tour package by ID (protected)
 *     tags: [Tours]
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
 *             description: Any subset of tour fields to update
 *             properties:
 *               slug:          { type: string }
 *               title:         { type: string }
 *               destination:   { type: string }
 *               country:       { type: string }
 *               category:      { type: string }
 *               duration:      { type: string }
 *               image:         { type: string }
 *               description:   { type: string }
 *               highlights:    { type: array, items: { type: string } }
 *               includes:      { type: array, items: { type: string } }
 *               priceUSD:      { type: number }
 *               priceNGN:      { type: number }
 *               departureDate: { type: string, format: date-time }
 *               maxGroupSize:  { type: integer }
 *               requiresVisa:  { type: boolean }
 *               isActive:      { type: boolean }
 *               isFeatured:    { type: boolean }
 *               sortOrder:     { type: integer }
 *     responses:
 *       200:
 *         description: Tour updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', requireAuth, updateTour);

/**
 * @swagger
 * /api/tours/{id}:
 *   delete:
 *     summary: Delete a tour package by ID (protected)
 *     tags: [Tours]
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
 *         description: Tour deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireAuth, deleteTour);

export { router as toursRouter };