import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmationEmail } from '../utils/email';
import { notifyBookingViaTermii } from '../utils/termii';

const prisma = new PrismaClient();

//Helper: generate booking ref like LBG-2026-00001 
async function generateBookingRef(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count();
  const seq = String(count + 1).padStart(5, '0');
  return `LBG-${year}-${seq}`;
}

//POST /api/bookings 
export async function createBooking(req: Request, res: Response): Promise<void> {
  const { service, customerName, email, phone, details, paymentMethod, referralCode, amount } = req.body;

  if (!service || !customerName || !email || !phone) {
    res.status(400).json({ error: 'service, customerName, email, and phone are required' });
    return;
  }

  const validServices = ['Pilgrimage', 'Hotel', 'Tour', 'Visa', 'Ticketing', 'Admission'];
  if (!validServices.includes(service)) {
    res.status(400).json({ error: `service must be one of: ${validServices.join(', ')}` });
    return;
  }

  try {
    const bookingRef = await generateBookingRef();

    const booking = await prisma.booking.create({
      data: {
        bookingRef,
        service,
        customerName,
        email,
        phone,
        details: details || {},
        paymentMethod: paymentMethod || null,
        referralCode: referralCode ? referralCode.toUpperCase() : null,
        amount: amount || null,
        status: 'pending',
      },
    });

    // Increment ambassador referral count — non-critical, never fails the booking
    if (referralCode) {
      await prisma.lWARegistration
        .updateMany({
          where: { lwaCode: referralCode.toUpperCase(), status: 'active' },
          data: { totalReferrals: { increment: 1 } },
        })
        .catch(() => {});
    }

    // Send confirmation email — non-blocking
    sendBookingConfirmationEmail(booking).catch((err) => {
      console.error('Email send failed:', err);
    });

    // Send SMS via Termii — non-blocking
    notifyBookingViaTermii({
      customerName: booking.customerName,
      email: booking.email,
      phone: booking.phone,
      service: booking.service,
      bookingRef: booking.bookingRef,
    }).catch(() => {});

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: booking.id,
        bookingRef: booking.bookingRef,
        service: booking.service,
        customerName: booking.customerName,
        status: booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (err) {
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
}

//GET /api/bookings 
export async function listBookings(req: Request, res: Response): Promise<void> {
  const { service, status, search, referralCode, page = '1', limit = '50' } = req.query as Record<string, string>;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * limitNum;

  const where: Record<string, unknown> = {};
  if (service)      where.service      = service;
  if (status)       where.status       = status;
  if (referralCode) where.referralCode = referralCode.toUpperCase();
  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { email:        { contains: search, mode: 'insensitive' } },
      { bookingRef:   { contains: search, mode: 'insensitive' } },
      { phone:        { contains: search } },
    ];
  }

  try {
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error('List bookings error:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
}

//GET /api/bookings/:id 
export async function getBooking(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid booking ID' });
    return;
  }

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json({ booking });
  } catch (err) {
    console.error('Get booking error:', err);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
}

//PATCH /api/bookings/:id/status 
export async function updateBookingStatus(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid booking ID' });
    return;
  }

  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
    return;
  }

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    res.json({ message: 'Status updated', booking });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === 'P2025') {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
}