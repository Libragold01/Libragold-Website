// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // POST /api/payments — record a payment attempt (called from frontend after Lotus Bank)
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//   const {
//     bookingId, reference, amount, currency, method,
//     status, lotusData, isInstallment, installmentNumber, installmentTotal,
//   } = req.body;

//   if (!bookingId || !reference || amount === undefined || !method) {
//     res.status(400).json({ error: 'bookingId, reference, amount, method are required' });
//     return;
//   }

//   try {
//     const payment = await prisma.payment.create({
//       data: {
//         bookingId: parseInt(bookingId),
//         reference,
//         amount: parseFloat(amount),
//         currency: currency || 'NGN',
//         method,
//         status: status || 'pending',
//         lotusData: lotusData || null,
//         isInstallment: isInstallment === true || isInstallment === 'true',
//         installmentNumber: installmentNumber ? parseInt(installmentNumber) : null,
//         installmentTotal: installmentTotal ? parseInt(installmentTotal) : null,
//       },
//     });
//     res.status(201).json({ message: 'Payment recorded', payment });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2002') {
//       res.status(409).json({ error: 'Payment with this reference already exists' }); return;
//     }
//     console.error('Record payment error:', err);
//     res.status(500).json({ error: 'Failed to record payment' });
//   }
// });

// // PATCH /api/payments/:reference/status — update payment status (webhook or manual)
// router.patch('/:reference/status', async (req: Request, res: Response): Promise<void> => {
//   const { status, lotusData } = req.body;
//   const validStatuses = ['pending', 'success', 'failed'];

//   if (!status || !validStatuses.includes(status)) {
//     res.status(400).json({ error: 'status must be pending, success, or failed' });
//     return;
//   }

//   try {
//     const payment = await prisma.payment.update({
//       where: { reference: req.params.reference },
//       data: {
//         status,
//         ...(lotusData && { lotusData }),
//       },
//     });

//     // Auto-confirm booking if payment is successful
//     if (status === 'success') {
//       await prisma.booking.update({
//         where: { id: payment.bookingId },
//         data: { status: 'confirmed' },
//       }).catch(() => {});
//     }

//     res.json({ message: 'Payment status updated', payment });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Payment not found' }); return;
//     }
//     res.status(500).json({ error: 'Failed to update payment status' });
//   }
// });

// // GET /api/payments — admin list all payments
// router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const { status, page = '1', limit = '50' } = req.query as Record<string, string>;
//   const pageNum = Math.max(1, parseInt(page, 10));
//   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

//   const where: Record<string, unknown> = {};
//   if (status) where.status = status;

//   try {
//     const [payments, total] = await Promise.all([
//       prisma.payment.findMany({
//         where,
//         include: {
//           booking: {
//             select: {
//               bookingRef: true, customerName: true, email: true, service: true,
//             },
//           },
//         },
//         orderBy: { createdAt: 'desc' },
//         skip: (pageNum - 1) * limitNum,
//         take: limitNum,
//       }),
//       prisma.payment.count({ where }),
//     ]);

//     res.json({
//       payments,
//       pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
//     });
//   } catch (err) {
//     console.error('List payments error:', err);
//     res.status(500).json({ error: 'Failed to fetch payments' });
//   }
// });

// export { router as paymentsRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  recordPayment,
  updatePaymentStatus,
  listPayments,
} from '../controllers/paymentController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment recording and status management
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a new payment attempt (public — called from frontend after Lotus Bank)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingId, reference, amount, method]
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 12
 *               reference:
 *                 type: string
 *                 example: LOTUS-REF-20260001
 *               amount:
 *                 type: number
 *                 example: 5700000
 *               currency:
 *                 type: string
 *                 default: NGN
 *               method:
 *                 type: string
 *                 enum: [card, transfer]
 *               status:
 *                 type: string
 *                 enum: [pending, success, failed]
 *                 default: pending
 *               lotusData:
 *                 type: object
 *                 description: Raw response from Lotus Bank (optional)
 *               isInstallment:
 *                 type: boolean
 *                 default: false
 *               installmentNumber:
 *                 type: integer
 *                 example: 1
 *               installmentTotal:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Payment with this reference already exists
 */
router.post('/', recordPayment);

/**
 * @swagger
 * /api/payments/{reference}/status:
 *   patch:
 *     summary: Update payment status — webhook or manual update (public with reference)
 *     description: |
 *       Called by the Lotus Bank webhook when payment is confirmed or failed.
 *       Also usable manually by admin. Automatically confirms the linked booking
 *       when status is set to "success".
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Lotus Bank payment reference
 *         example: LOTUS-REF-20260001
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
 *                 enum: [pending, success, failed]
 *               lotusData:
 *                 type: object
 *                 description: Updated raw response from Lotus Bank (optional)
 *     responses:
 *       200:
 *         description: Payment status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   $ref: '#/components/schemas/Payment'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:reference/status', updatePaymentStatus);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: List all payments with pagination (protected)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed]
 *         description: Filter by payment status
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
 *         description: Paginated list of payments with linked booking info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Payment'
 *                       - type: object
 *                         properties:
 *                           booking:
 *                             type: object
 *                             properties:
 *                               bookingRef:   { type: string }
 *                               customerName: { type: string }
 *                               email:        { type: string }
 *                               service:      { type: string }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page:  { type: integer }
 *                     limit: { type: integer }
 *                     pages: { type: integer }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/', requireAuth, listPayments);

export { router as paymentsRouter };