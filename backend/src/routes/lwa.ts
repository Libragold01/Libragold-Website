// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';
// import { sendLWAWelcomeEmail } from '../utils/email';
// import { notifyLWAViaTermii } from '../utils/termii';

// const router = Router();
// const prisma = new PrismaClient();

// // Generate the next sequential LWA code (server-side, authoritative)
// async function getNextLWACode(): Promise<{ code: string; number: number }> {
//   // Use a transaction to avoid race conditions
//   const result = await prisma.$transaction(async (tx) => {
//     const lastEntry = await tx.lWARegistration.findFirst({
//       orderBy: { codeNumber: 'desc' },
//       select: { codeNumber: true },
//     });
//     const nextNumber = (lastEntry?.codeNumber ?? 0) + 1;
//     const code = 'LWA' + String(nextNumber).padStart(2, '0');
//     return { code, number: nextNumber };
//   });
//   return result;
// }

// // POST /api/lwa/register — register new ambassador (public)
// router.post('/register', async (req: Request, res: Response): Promise<void> => {
//   const { fullName, email, phone, city, occupation, socialMedia, howHeard } = req.body;

//   if (!fullName || !email || !phone || !city || !occupation || !howHeard) {
//     res.status(400).json({
//       error: 'fullName, email, phone, city, occupation, and howHeard are required',
//     });
//     return;
//   }

//   // Check for duplicate email
//   const existing = await prisma.lWARegistration.findFirst({ where: { email } });
//   if (existing) {
//     res.status(409).json({
//       error: 'An ambassador with this email address already exists',
//       lwaCode: existing.lwaCode,
//     });
//     return;
//   }

//   try {
//     const { code, number } = await getNextLWACode();

//     const ambassador = await prisma.lWARegistration.create({
//       data: {
//         lwaCode: code,
//         codeNumber: number,
//         fullName,
//         email,
//         phone,
//         city,
//         occupation,
//         socialMedia: socialMedia || null,
//         howHeard,
//         status: 'active',
//       },
//     });

//     // Send welcome email (non-blocking)
//     sendLWAWelcomeEmail(ambassador).catch((err) => {
//       console.error('LWA email send failed:', err);
//     });

//     // Collect contact + send SMS via Termii (non-blocking)
//     notifyLWAViaTermii({
//       fullName: ambassador.fullName,
//       email: ambassador.email,
//       phone: ambassador.phone,
//       lwaCode: ambassador.lwaCode,
//     }).catch(() => {});

//     res.status(201).json({
//       message: 'Ambassador registered successfully',
//       ambassador: {
//         id: ambassador.id,
//         lwaCode: ambassador.lwaCode,
//         fullName: ambassador.fullName,
//         status: ambassador.status,
//         createdAt: ambassador.createdAt,
//       },
//     });
//   } catch (err) {
//     console.error('LWA register error:', err);
//     res.status(500).json({ error: 'Failed to register ambassador' });
//   }
// });

// // GET /api/lwa — list all ambassadors (protected)
// router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const { status, search, page = '1', limit = '50' } = req.query as Record<string, string>;

//   const pageNum = Math.max(1, parseInt(page, 10));
//   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
//   const skip = (pageNum - 1) * limitNum;

//   const where: Record<string, unknown> = {};
//   if (status) where.status = status;
//   if (search) {
//     where.OR = [
//       { fullName: { contains: search, mode: 'insensitive' } },
//       { email: { contains: search, mode: 'insensitive' } },
//       { lwaCode: { contains: search, mode: 'insensitive' } },
//       { phone: { contains: search } },
//       { city: { contains: search, mode: 'insensitive' } },
//     ];
//   }

//   try {
//     const [ambassadors, total] = await Promise.all([
//       prisma.lWARegistration.findMany({
//         where,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limitNum,
//       }),
//       prisma.lWARegistration.count({ where }),
//     ]);

//     res.json({
//       ambassadors,
//       pagination: {
//         total,
//         page: pageNum,
//         limit: limitNum,
//         pages: Math.ceil(total / limitNum),
//       },
//     });
//   } catch (err) {
//     console.error('List LWA error:', err);
//     res.status(500).json({ error: 'Failed to fetch ambassadors' });
//   }
// });

// // PATCH /api/lwa/:id/status — activate or suspend (protected)
// router.patch('/:id/status', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   const { status } = req.body;

//   if (isNaN(id)) {
//     res.status(400).json({ error: 'Invalid ambassador ID' });
//     return;
//   }

//   const validStatuses = ['active', 'suspended'];
//   if (!status || !validStatuses.includes(status)) {
//     res.status(400).json({ error: 'status must be either "active" or "suspended"' });
//     return;
//   }

//   try {
//     const ambassador = await prisma.lWARegistration.update({
//       where: { id },
//       data: { status },
//     });
//     res.json({ message: `Ambassador ${status}`, ambassador });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Ambassador not found' });
//       return;
//     }
//     console.error('Update LWA status error:', err);
//     res.status(500).json({ error: 'Failed to update ambassador status' });
//   }
// });

// export { router as lwaRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  registerAmbassador,
  listAmbassadors,
  updateAmbassadorStatus,
} from '../controllers/lwaController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: LWA
 *   description: Libragold Work Ambassador program
 */

/**
 * @swagger
 * /api/lwa/register:
 *   post:
 *     summary: Register a new ambassador (public)
 *     tags: [LWA]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, phone, city, occupation, howHeard]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Fatimah Aliyu
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fatimah@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348023456789"
 *               city:
 *                 type: string
 *                 example: Abuja
 *               occupation:
 *                 type: string
 *                 example: Teacher
 *               socialMedia:
 *                 type: string
 *                 example: "@fatimah_travels"
 *               howHeard:
 *                 type: string
 *                 example: WhatsApp group
 *     responses:
 *       201:
 *         description: Ambassador registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ambassador:
 *                   type: object
 *                   properties:
 *                     id:        { type: integer }
 *                     lwaCode:   { type: string, example: LWA042 }
 *                     fullName:  { type: string }
 *                     status:    { type: string, enum: [active, suspended] }
 *                     createdAt: { type: string, format: date-time }
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Ambassador with this email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:   { type: string }
 *                 lwaCode: { type: string, example: LWA015 }
 */
router.post('/register', registerAmbassador);

/**
 * @swagger
 * /api/lwa:
 *   get:
 *     summary: List all ambassadors with filters and pagination (protected)
 *     tags: [LWA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, suspended]
 *         description: Filter by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, phone, city, or LWA code
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *     responses:
 *       200:
 *         description: Paginated list of ambassadors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ambassadors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:            { type: integer }
 *                       lwaCode:       { type: string }
 *                       fullName:      { type: string }
 *                       email:         { type: string }
 *                       phone:         { type: string }
 *                       city:          { type: string }
 *                       occupation:    { type: string }
 *                       status:        { type: string }
 *                       totalReferrals:{ type: integer }
 *                       createdAt:     { type: string, format: date-time }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:  { type: integer }
 *                     page:   { type: integer }
 *                     limit:  { type: integer }
 *                     pages:  { type: integer }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', requireAuth, listAmbassadors);

/**
 * @swagger
 * /api/lwa/{id}/status:
 *   patch:
 *     summary: Activate or suspend an ambassador (protected)
 *     tags: [LWA]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ambassador ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended]
 *     responses:
 *       200:
 *         description: Ambassador status updated
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/status', requireAuth, updateAmbassadorStatus);

export { router as lwaRouter };