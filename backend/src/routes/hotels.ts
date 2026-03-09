// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/hotels — public
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//   const { country, active } = req.query as Record<string, string>;
//   const where: Record<string, unknown> = {};
//   if (country) where.country = country;
//   if (active !== 'all') where.isActive = true;

//   try {
//     const hotels = await prisma.hotel.findMany({
//       where,
//       orderBy: [{ isFeatured: 'desc' }, { stars: 'desc' }, { sortOrder: 'asc' }],
//     });
//     res.json({ hotels });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch hotels' });
//   }
// });

// // GET /api/hotels/:slug — public single
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const hotel = await prisma.hotel.findUnique({ where: { slug: req.params.slug } });
//     if (!hotel) { res.status(404).json({ error: 'Hotel not found' }); return; }
//     res.json({ hotel });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch hotel' });
//   }
// });

// // POST /api/hotels — admin create
// router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const {
//     slug, name, location, country, stars, image, description,
//     amenities, roomTypes, distanceFromHaram, isActive, isFeatured, sortOrder,
//   } = req.body;

//   if (!slug || !name || !location || !country || !description || !roomTypes) {
//     res.status(400).json({ error: 'slug, name, location, country, description, roomTypes are required' });
//     return;
//   }

//   try {
//     const hotel = await prisma.hotel.create({
//       data: {
//         slug, name, location, country, stars: parseInt(stars || 3),
//         image: image || null, description, amenities: amenities || [],
//         roomTypes, distanceFromHaram: distanceFromHaram || null,
//         isActive: isActive !== false, isFeatured: isFeatured === true,
//         sortOrder: parseInt(sortOrder || 0),
//       },
//     });
//     res.status(201).json({ message: 'Hotel created', hotel });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'A hotel with this slug already exists' }); return;
//     }
//     console.error('Create hotel error:', err);
//     res.status(500).json({ error: 'Failed to create hotel' });
//   }
// });

// // PUT /api/hotels/:id — admin update
// router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   const {
//     slug, name, location, country, stars, image, description,
//     amenities, roomTypes, distanceFromHaram, isActive, isFeatured, sortOrder,
//   } = req.body;

//   try {
//     const hotel = await prisma.hotel.update({
//       where: { id },
//       data: {
//         ...(slug && { slug }),
//         ...(name && { name }),
//         ...(location && { location }),
//         ...(country && { country }),
//         ...(stars !== undefined && { stars: parseInt(stars) }),
//         image: image !== undefined ? image : undefined,
//         ...(description && { description }),
//         ...(amenities && { amenities }),
//         ...(roomTypes && { roomTypes }),
//         distanceFromHaram: distanceFromHaram !== undefined ? distanceFromHaram : undefined,
//         ...(isActive !== undefined && { isActive }),
//         ...(isFeatured !== undefined && { isFeatured }),
//         ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
//       },
//     });
//     res.json({ message: 'Hotel updated', hotel });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Hotel not found' }); return; }
//     res.status(500).json({ error: 'Failed to update hotel' });
//   }
// });

// // DELETE /api/hotels/:id — admin delete
// router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
//   try {
//     await prisma.hotel.delete({ where: { id } });
//     res.json({ message: 'Hotel deleted' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Hotel not found' }); return; }
//     res.status(500).json({ error: 'Failed to delete hotel' });
//   }
// });

// export { router as hotelsRouter };



import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelsController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel listings management
 */

/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: List all hotels (public)
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: Filter by country (e.g. Saudi Arabia)
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [all]
 *         description: Pass "all" to include inactive hotels (admin use)
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hotels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:               { type: integer }
 *                       slug:             { type: string }
 *                       name:             { type: string }
 *                       location:         { type: string }
 *                       country:          { type: string }
 *                       stars:            { type: integer }
 *                       image:            { type: string }
 *                       description:      { type: string }
 *                       amenities:        { type: array, items: { type: string } }
 *                       roomTypes:        { type: object }
 *                       distanceFromHaram:{ type: string }
 *                       isActive:         { type: boolean }
 *                       isFeatured:       { type: boolean }
 *                       sortOrder:        { type: integer }
 *       500:
 *         description: Internal server error
 */
router.get('/', listHotels);

/**
 * @swagger
 * /api/hotels/{slug}:
 *   get:
 *     summary: Get a single hotel by slug (public)
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: fairmont-makkah
 *     responses:
 *       200:
 *         description: Hotel details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */
router.get('/:slug', getHotel);

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Create a new hotel (protected)
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, name, location, country, description, roomTypes]
 *             properties:
 *               slug:             { type: string, example: fairmont-makkah }
 *               name:             { type: string, example: Fairmont Makkah Clock Hotel }
 *               location:         { type: string, example: Makkah }
 *               country:          { type: string, example: Saudi Arabia }
 *               stars:            { type: integer, example: 5 }
 *               image:            { type: string }
 *               description:      { type: string }
 *               amenities:        { type: array, items: { type: string } }
 *               roomTypes:        { type: object, description: JSON array of room type objects }
 *               distanceFromHaram:
 *                 type: string
 *                 example: Steps from Masjid Al Haram
 *               isActive:         { type: boolean, default: true }
 *               isFeatured:       { type: boolean, default: false }
 *               sortOrder:        { type: integer, default: 0 }
 *     responses:
 *       201:
 *         description: Hotel created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A hotel with this slug already exists
 */
router.post('/', requireAuth, createHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     summary: Update a hotel by ID (protected)
 *     tags: [Hotels]
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
 *             description: Any subset of hotel fields to update
 *             properties:
 *               slug:             { type: string }
 *               name:             { type: string }
 *               location:         { type: string }
 *               country:          { type: string }
 *               stars:            { type: integer }
 *               image:            { type: string }
 *               description:      { type: string }
 *               amenities:        { type: array, items: { type: string } }
 *               roomTypes:        { type: object }
 *               distanceFromHaram:{ type: string }
 *               isActive:         { type: boolean }
 *               isFeatured:       { type: boolean }
 *               sortOrder:        { type: integer }
 *     responses:
 *       200:
 *         description: Hotel updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', requireAuth, updateHotel);

/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel by ID (protected)
 *     tags: [Hotels]
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
 *         description: Hotel deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireAuth, deleteHotel);

export { router as hotelsRouter };