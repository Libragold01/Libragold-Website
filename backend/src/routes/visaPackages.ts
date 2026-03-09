// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/visa-packages — public
// router.get('/', async (req: Request, res: Response): Promise<void> => {
//   const { active } = req.query as Record<string, string>;
//   const where: Record<string, unknown> = {};
//   if (active !== 'all') where.isActive = true;

//   try {
//     const packages = await prisma.visaPackage.findMany({
//       where,
//       orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { country: 'asc' }],
//     });
//     res.json({ packages });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch visa packages' });
//   }
// });

// // GET /api/visa-packages/:slug — public single
// router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
//   try {
//     const pkg = await prisma.visaPackage.findUnique({ where: { slug: req.params.slug } });
//     if (!pkg) { res.status(404).json({ error: 'Visa package not found' }); return; }
//     res.json({ package: pkg });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch visa package' });
//   }
// });

// // POST /api/visa-packages — admin create
// router.post('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const {
//     slug, name, country, flag, priceUSD, priceNGN,
//     processingTime, validity, requirements, description,
//     isActive, isFeatured, sortOrder,
//   } = req.body;

//   if (!slug || !name || !country || priceNGN === undefined || !processingTime || !description) {
//     res.status(400).json({ error: 'slug, name, country, priceNGN, processingTime, description are required' });
//     return;
//   }

//   try {
//     const pkg = await prisma.visaPackage.create({
//       data: {
//         slug, name, country, flag: flag || null,
//         priceUSD: parseFloat(priceUSD || 0), priceNGN: parseFloat(priceNGN),
//         processingTime, validity: validity || null,
//         requirements: requirements || [], description,
//         isActive: isActive !== false, isFeatured: isFeatured === true,
//         sortOrder: parseInt(sortOrder || 0),
//       },
//     });
//     res.status(201).json({ message: 'Visa package created', package: pkg });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'A visa package with this slug already exists' }); return;
//     }
//     console.error('Create visa package error:', err);
//     res.status(500).json({ error: 'Failed to create visa package' });
//   }
// });

// // PUT /api/visa-packages/:id — admin update
// router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }

//   const {
//     slug, name, country, flag, priceUSD, priceNGN,
//     processingTime, validity, requirements, description,
//     isActive, isFeatured, sortOrder,
//   } = req.body;

//   try {
//     const pkg = await prisma.visaPackage.update({
//       where: { id },
//       data: {
//         ...(slug && { slug }),
//         ...(name && { name }),
//         ...(country && { country }),
//         flag: flag !== undefined ? flag : undefined,
//         ...(priceUSD !== undefined && { priceUSD: parseFloat(priceUSD) }),
//         ...(priceNGN !== undefined && { priceNGN: parseFloat(priceNGN) }),
//         ...(processingTime && { processingTime }),
//         validity: validity !== undefined ? validity : undefined,
//         ...(requirements && { requirements }),
//         ...(description && { description }),
//         ...(isActive !== undefined && { isActive }),
//         ...(isFeatured !== undefined && { isFeatured }),
//         ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
//       },
//     });
//     res.json({ message: 'Visa package updated', package: pkg });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Visa package not found' }); return; }
//     res.status(500).json({ error: 'Failed to update visa package' });
//   }
// });

// // DELETE /api/visa-packages/:id — admin delete
// router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) { res.status(400).json({ error: 'Invalid ID' }); return; }
//   try {
//     await prisma.visaPackage.delete({ where: { id } });
//     res.json({ message: 'Visa package deleted' });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') { res.status(404).json({ error: 'Visa package not found' }); return; }
//     res.status(500).json({ error: 'Failed to delete visa package' });
//   }
// });

// export { router as visaPackagesRouter };



import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  listVisaPackages,
  getVisaPackage,
  createVisaPackage,
  updateVisaPackage,
  deleteVisaPackage,
} from '../controllers/visaPackage';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Visa Packages
 *   description: Visa processing packages
 */

/**
 * @swagger
 * /api/visa-packages:
 *   get:
 *     summary: List all visa packages (public)
 *     tags: [Visa Packages]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [all]
 *         description: Pass "all" to include inactive packages (admin use)
 *     responses:
 *       200:
 *         description: List of visa packages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:             { type: integer }
 *                       slug:           { type: string }
 *                       name:           { type: string }
 *                       country:        { type: string }
 *                       flag:           { type: string, example: "🇸🇦" }
 *                       priceUSD:       { type: number }
 *                       priceNGN:       { type: number }
 *                       processingTime: { type: string }
 *                       validity:       { type: string }
 *                       requirements:   { type: array, items: { type: string } }
 *                       description:    { type: string }
 *                       isActive:       { type: boolean }
 *                       isFeatured:     { type: boolean }
 *       500:
 *         description: Internal server error
 */
router.get('/', listVisaPackages);

/**
 * @swagger
 * /api/visa-packages/{slug}:
 *   get:
 *     summary: Get a single visa package by slug (public)
 *     tags: [Visa Packages]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: schengen-visa
 *     responses:
 *       200:
 *         description: Visa package details
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error
 */
router.get('/:slug', getVisaPackage);

/**
 * @swagger
 * /api/visa-packages:
 *   post:
 *     summary: Create a new visa package (protected)
 *     tags: [Visa Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, name, country, priceNGN, processingTime, description]
 *             properties:
 *               slug:           { type: string, example: schengen-visa }
 *               name:           { type: string, example: "Schengen Visa (6 Months)" }
 *               country:        { type: string, example: "Europe (Schengen Area)" }
 *               flag:           { type: string, example: "🇪🇺" }
 *               priceUSD:       { type: number, example: 0 }
 *               priceNGN:       { type: number, example: 350000 }
 *               processingTime: { type: string, example: "15 working days" }
 *               validity:       { type: string, example: "6 Months" }
 *               requirements:   { type: array, items: { type: string } }
 *               description:    { type: string }
 *               isActive:       { type: boolean, default: true }
 *               isFeatured:     { type: boolean, default: false }
 *               sortOrder:      { type: integer, default: 0 }
 *     responses:
 *       201:
 *         description: Visa package created
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: A visa package with this slug already exists
 */
router.post('/', requireAuth, createVisaPackage);

/**
 * @swagger
 * /api/visa-packages/{id}:
 *   put:
 *     summary: Update a visa package by ID (protected)
 *     tags: [Visa Packages]
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
 *             description: Any subset of visa package fields to update
 *             properties:
 *               slug:           { type: string }
 *               name:           { type: string }
 *               country:        { type: string }
 *               flag:           { type: string }
 *               priceUSD:       { type: number }
 *               priceNGN:       { type: number }
 *               processingTime: { type: string }
 *               validity:       { type: string }
 *               requirements:   { type: array, items: { type: string } }
 *               description:    { type: string }
 *               isActive:       { type: boolean }
 *               isFeatured:     { type: boolean }
 *               sortOrder:      { type: integer }
 *     responses:
 *       200:
 *         description: Visa package updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', requireAuth, updateVisaPackage);

/**
 * @swagger
 * /api/visa-packages/{id}:
 *   delete:
 *     summary: Delete a visa package by ID (protected)
 *     tags: [Visa Packages]
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
 *         description: Visa package deleted
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', requireAuth, deleteVisaPackage);

export { router as visaPackagesRouter };