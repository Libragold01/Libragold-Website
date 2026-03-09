import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/dashboard/stats — (protected)
router.get('/stats', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = ['Pilgrimage', 'Hotel', 'Tour', 'Visa', 'Ticketing', 'Admission'];
    const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    // Run all queries in parallel for performance
    const [
      totalBookings,
      bookingsByStatus,
      bookingsByService,
      totalAmbassadors,
      activeAmbassadors,
      recentBookings,
      recentAmbassadors,
    ] = await Promise.all([
      // Total bookings count
      prisma.booking.count(),

      // Bookings grouped by status
      prisma.booking.groupBy({
        by: ['status'],
        _count: { status: true },
      }),

      // Bookings grouped by service
      prisma.booking.groupBy({
        by: ['service'],
        _count: { service: true },
      }),

      // Total LWA ambassadors
      prisma.lWARegistration.count(),

      // Active LWA ambassadors
      prisma.lWARegistration.count({ where: { status: 'active' } }),

      // Recent 5 bookings
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          bookingRef: true,
          customerName: true,
          email: true,
          service: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      }),

      // Recent 5 ambassadors
      prisma.lWARegistration.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          lwaCode: true,
          fullName: true,
          city: true,
          status: true,
          totalReferrals: true,
          createdAt: true,
        },
      }),
    ]);

    // Build status map
    const statusCounts: Record<string, number> = {};
    statuses.forEach((s) => (statusCounts[s] = 0));
    bookingsByStatus.forEach((row) => {
      statusCounts[row.status] = row._count.status;
    });

    // Build service map
    const serviceCounts: Record<string, number> = {};
    services.forEach((s) => (serviceCounts[s] = 0));
    bookingsByService.forEach((row) => {
      serviceCounts[row.service] = row._count.service;
    });

    res.json({
      bookings: {
        total: totalBookings,
        byStatus: statusCounts,
        byService: serviceCounts,
      },
      ambassadors: {
        total: totalAmbassadors,
        active: activeAmbassadors,
        suspended: totalAmbassadors - activeAmbassadors,
      },
      recentBookings,
      recentAmbassadors,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export { router as dashboardRouter };
