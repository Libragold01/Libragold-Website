// import { Router, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import { requireAuth, AuthRequest } from '../middleware/auth';

// const router = Router();
// const prisma = new PrismaClient();

// // GET /api/dashboard/stats — (protected)
// router.get('/stats', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const services = ['Pilgrimage', 'Hotel', 'Tour', 'Visa', 'Ticketing', 'Admission'];
//     const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

//     // Run all queries in parallel for performance
//     const [
//       totalBookings,
//       bookingsByStatus,
//       bookingsByService,
//       totalAmbassadors,
//       activeAmbassadors,
//       recentBookings,
//       recentAmbassadors,
//     ] = await Promise.all([
//       // Total bookings count
//       prisma.booking.count(),

//       // Bookings grouped by status
//       prisma.booking.groupBy({
//         by: ['status'],
//         _count: { status: true },
//       }),

//       // Bookings grouped by service
//       prisma.booking.groupBy({
//         by: ['service'],
//         _count: { service: true },
//       }),

//       // Total LWA ambassadors
//       prisma.lWARegistration.count(),

//       // Active LWA ambassadors
//       prisma.lWARegistration.count({ where: { status: 'active' } }),

//       // Recent 5 bookings
//       prisma.booking.findMany({
//         orderBy: { createdAt: 'desc' },
//         take: 5,
//         select: {
//           id: true,
//           bookingRef: true,
//           customerName: true,
//           email: true,
//           service: true,
//           amount: true,
//           status: true,
//           createdAt: true,
//         },
//       }),

//       // Recent 5 ambassadors
//       prisma.lWARegistration.findMany({
//         orderBy: { createdAt: 'desc' },
//         take: 5,
//         select: {
//           id: true,
//           lwaCode: true,
//           fullName: true,
//           city: true,
//           status: true,
//           totalReferrals: true,
//           createdAt: true,
//         },
//       }),
//     ]);

//     // Build status map
//     const statusCounts: Record<string, number> = {};
//     statuses.forEach((s) => (statusCounts[s] = 0));
//     bookingsByStatus.forEach((row) => {
//       statusCounts[row.status] = row._count.status;
//     });

//     // Build service map
//     const serviceCounts: Record<string, number> = {};
//     services.forEach((s) => (serviceCounts[s] = 0));
//     bookingsByService.forEach((row) => {
//       serviceCounts[row.service] = row._count.service;
//     });

//     res.json({
//       bookings: {
//         total: totalBookings,
//         byStatus: statusCounts,
//         byService: serviceCounts,
//       },
//       ambassadors: {
//         total: totalAmbassadors,
//         active: activeAmbassadors,
//         suspended: totalAmbassadors - activeAmbassadors,
//       },
//       recentBookings,
//       recentAmbassadors,
//     });
//   } catch (err) {
//     console.error('Dashboard stats error:', err);
//     res.status(500).json({ error: 'Failed to fetch dashboard stats' });
//   }
// });

// export { router as dashboardRouter };

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getDashboardStats } from '../controllers/dashboard';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Admin dashboard statistics
 */

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Get dashboard overview statistics (protected)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including bookings, ambassadors, and recent activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 142
 *                     byStatus:
 *                       type: object
 *                       properties:
 *                         pending:   { type: integer, example: 40 }
 *                         confirmed: { type: integer, example: 80 }
 *                         cancelled: { type: integer, example: 10 }
 *                         completed: { type: integer, example: 12 }
 *                     byService:
 *                       type: object
 *                       properties:
 *                         Pilgrimage: { type: integer }
 *                         Hotel:      { type: integer }
 *                         Tour:       { type: integer }
 *                         Visa:       { type: integer }
 *                         Ticketing:  { type: integer }
 *                         Admission:  { type: integer }
 *                 ambassadors:
 *                   type: object
 *                   properties:
 *                     total:     { type: integer, example: 35 }
 *                     active:    { type: integer, example: 30 }
 *                     suspended: { type: integer, example: 5 }
 *                 recentBookings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *                 recentAmbassadors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:            { type: integer }
 *                       lwaCode:       { type: string, example: LWA-00042 }
 *                       fullName:      { type: string }
 *                       city:          { type: string }
 *                       status:        { type: string, enum: [active, suspended] }
 *                       totalReferrals:{ type: integer }
 *                       createdAt:     { type: string, format: date-time }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Internal server error
 */
router.get('/stats', requireAuth, getDashboardStats);

export { router as dashboardRouter };