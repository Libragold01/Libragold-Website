// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth } from '../middleware/auth';
// import { sendBookingConfirmationEmail } from '../utils/email';
// import { notifyBookingViaTermii } from '../utils/termii';

// const router = Router();
// const prisma = new PrismaClient();

// // Generate a unique booking reference like LBG-2026-00001
// async function generateBookingRef(): Promise<string> {
//   const year = new Date().getFullYear();
//   const count = await prisma.booking.count();
//   const seq = String(count + 1).padStart(5, '0');
//   return `LBG-${year}-${seq}`;
// }

// // POST /api/bookings — create a new booking (public)
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//   const {
//     service,
//     customerName,
//     email,
//     phone,
//     details,
//     paymentMethod,
//     referralCode,
//     amount,
//   } = req.body;

//   if (!service || !customerName || !email || !phone) {
//     res.status(400).json({ error: 'service, customerName, email, and phone are required' });
//     return;
//   }

//   const validServices = ['Pilgrimage', 'Hotel', 'Tour', 'Visa', 'Ticketing', 'Admission'];
//   if (!validServices.includes(service)) {
//     res.status(400).json({ error: `service must be one of: ${validServices.join(', ')}` });
//     return;
//   }

//   try {
//     const bookingRef = await generateBookingRef();

//     const booking = await prisma.booking.create({
//       data: {
//         bookingRef,
//         service,
//         customerName,
//         email,
//         phone,
//         details: details || {},
//         paymentMethod: paymentMethod || null,
//         referralCode: referralCode ? referralCode.toUpperCase() : null,
//         amount: amount || null,
//         status: 'pending',
//       },
//     });

//     // If a referral code was used, increment the ambassador's referral count
//     if (referralCode) {
//       await prisma.lWARegistration
//         .updateMany({
//           where: { lwaCode: referralCode.toUpperCase(), status: 'active' },
//           data: { totalReferrals: { increment: 1 } },
//         })
//         .catch(() => {
//           // Non-critical — don't fail the booking if referral update fails
//         });
//     }

//     // Send confirmation email (non-blocking)
//     sendBookingConfirmationEmail(booking).catch((err) => {
//       console.error('Email send failed:', err);
//     });

//     // Collect contact + send SMS via Termii (non-blocking)
//     notifyBookingViaTermii({
//       customerName: booking.customerName,
//       email: booking.email,
//       phone: booking.phone,
//       service: booking.service,
//       bookingRef: booking.bookingRef,
//     }).catch(() => {});

//     res.status(201).json({
//       message: 'Booking created successfully',
//       booking: {
//         id: booking.id,
//         bookingRef: booking.bookingRef,
//         service: booking.service,
//         customerName: booking.customerName,
//         status: booking.status,
//         createdAt: booking.createdAt,
//       },
//     });
//   } catch (err) {
//     console.error('Create booking error:', err);
//     res.status(500).json({ error: 'Failed to create booking' });
//   }
// });

// // GET /api/bookings — list all bookings (protected)
// router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const { service, status, search, page = '1', limit = '50' } = req.query as Record<string, string>;

//   const pageNum = Math.max(1, parseInt(page, 10));
//   const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
//   const skip = (pageNum - 1) * limitNum;

//   // Build where clause
//   const where: Record<string, unknown> = {};
//   if (service) where.service = service;
//   if (status) where.status = status;
//   if (search) {
//     where.OR = [
//       { customerName: { contains: search, mode: 'insensitive' } },
//       { email: { contains: search, mode: 'insensitive' } },
//       { bookingRef: { contains: search, mode: 'insensitive' } },
//       { phone: { contains: search } },
//     ];
//   }

//   try {
//     const [bookings, total] = await Promise.all([
//       prisma.booking.findMany({
//         where,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limitNum,
//       }),
//       prisma.booking.count({ where }),
//     ]);

//     res.json({
//       bookings,
//       pagination: {
//         total,
//         page: pageNum,
//         limit: limitNum,
//         pages: Math.ceil(total / limitNum),
//       },
//     });
//   } catch (err) {
//     console.error('List bookings error:', err);
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });

// // GET /api/bookings/:id — single booking (protected)
// router.get('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   if (isNaN(id)) {
//     res.status(400).json({ error: 'Invalid booking ID' });
//     return;
//   }

//   try {
//     const booking = await prisma.booking.findUnique({ where: { id } });
//     if (!booking) {
//       res.status(404).json({ error: 'Booking not found' });
//       return;
//     }
//     res.json({ booking });
//   } catch (err) {
//     console.error('Get booking error:', err);
//     res.status(500).json({ error: 'Failed to fetch booking' });
//   }
// });

// // PATCH /api/bookings/:id/status — update booking status (protected)
// router.patch('/:id/status', requireAuth, async (req: Request, res: Response): Promise<void> => {
//   const id = parseInt(req.params.id, 10);
//   const { status } = req.body;

//   if (isNaN(id)) {
//     res.status(400).json({ error: 'Invalid booking ID' });
//     return;
//   }

//   const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
//   if (!status || !validStatuses.includes(status)) {
//     res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
//     return;
//   }

//   try {
//     const booking = await prisma.booking.update({
//       where: { id },
//       data: { status },
//     });
//     res.json({ message: 'Status updated', booking });
//   } catch (err: unknown) {
//     if ((err as { code?: string }).code === 'P2025') {
//       res.status(404).json({ error: 'Booking not found' });
//       return;
//     }
//     console.error('Update status error:', err);
//     res.status(500).json({ error: 'Failed to update booking status' });
//   }
// });

// export { router as bookingsRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  createBooking,
  listBookings,
  getBooking,
  updateBookingStatus,
} from '../controllers/bookingController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking (public)
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service, customerName, email, phone]
 *             properties:
 *               service:
 *                 type: string
 *                 enum: [Pilgrimage, Hotel, Tour, Visa, Ticketing, Admission]
 *               customerName:
 *                 type: string
 *                 example: Yusuf Bello
 *               email:
 *                 type: string
 *                 format: email
 *                 example: yusuf@example.com
 *               phone:
 *                 type: string
 *                 example: "+2348012345678"
 *               details:
 *                 type: object
 *                 description: Service-specific details (flexible JSON)
 *               paymentMethod:
 *                 type: string
 *                 enum: [pay-now, pay-later, installment]
 *               referralCode:
 *                 type: string
 *                 example: LWA-00042
 *               amount:
 *                 type: string
 *                 example: "5700000"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         description: Internal server error
 */
router.post('/', createBooking);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: List all bookings with filters and pagination (protected)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *           enum: [Pilgrimage, Hotel, Tour, Visa, Ticketing, Admission]
 *         description: Filter by service type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *         description: Filter by booking status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, phone, or booking ref
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
 *         description: Paginated list of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
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
router.get('/', requireAuth, listBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get a single booking by ID (protected)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking:
 *                   $ref: '#/components/schemas/Booking'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', requireAuth, getBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (protected)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
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
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.patch('/:id/status', requireAuth, updateBookingStatus);

export { router as bookingsRouter };