// Libragold Backend API client
// All booking forms and LWA registrations post here first, Web3Forms email is a secondary notification

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

export interface BookingPayload {
  service: 'Pilgrimage' | 'Hotel' | 'Tour' | 'Visa' | 'Ticketing' | 'Admission';
  customerName: string;
  email: string;
  phone: string;
  details: Record<string, unknown>;
  paymentMethod?: string;
  referralCode?: string;
  amount?: string;
}

export interface BookingResult {
  message: string;
  booking: {
    id: number;
    bookingRef: string;
    service: string;
    customerName: string;
    status: string;
    createdAt: string;
  };
}

export interface LWAPayload {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  howHeard: string;
  socialMedia?: string;
}

export interface LWAResult {
  message: string;
  ambassador: {
    id: number;
    lwaCode: string;
    fullName: string;
    status: string;
    createdAt: string;
  };
}

export interface PaymentPayload {
  bookingId: number;
  reference: string;
  amount: number;
  currency?: string;
  method: string;
  status?: string;
  isInstallment?: boolean;
  installmentNumber?: number;
  installmentTotal?: number;
}

export const apiService = {
  /**
   * Submit a booking to the backend. Returns bookingRef for tracking.
   * Non-fatal — if this fails, the Web3Forms submission is still the fallback.
   */
  createBooking: (payload: BookingPayload): Promise<BookingResult> =>
    post('/bookings', payload),

  /**
   * Register a new LWA ambassador (server-side sequential code generation).
   */
  registerLWA: (payload: LWAPayload): Promise<LWAResult> =>
    post('/lwa/register', payload),

  /**
   * Record a payment attempt after Lotus Bank initialization.
   */
  recordPayment: (payload: PaymentPayload): Promise<{ message: string; payment: unknown }> =>
    post('/payments', payload),
};
