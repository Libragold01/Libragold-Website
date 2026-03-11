// Libragold Backend API client
// All booking forms and LWA registrations post here first, Web3Forms email is a secondary notification

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
const BACKEND_ORIGIN = BASE_URL.replace(/\/api$/, '');

// Wake up Render backend immediately on app load (prevents cold-start delays for users)
export function warmupBackend(): void {
  fetch(`${BACKEND_ORIGIN}/health`, { method: 'GET' }).catch(() => {/* ignore */});
}

// Resolve API-relative image paths (e.g. /uploads/...) to full backend URL
export function resolveImage(url: string | null | undefined, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith('/uploads/')) return `${BACKEND_ORIGIN}${url}`;
  return url;
}

// Retry up to 2 times with 3s delay — handles Render cold-start timeouts
async function get<T>(path: string, retries = 2): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data as T;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 3000));
      return get<T>(path, retries - 1);
    }
    throw err;
  }
}

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
  createBooking: (payload: BookingPayload): Promise<BookingResult> =>
    post('/bookings', payload),
  registerLWA: (payload: LWAPayload): Promise<LWAResult> =>
    post('/lwa/register', payload),
  recordPayment: (payload: PaymentPayload): Promise<{ message: string; payment: unknown }> =>
    post('/payments', payload),
  getHotels: (): Promise<{ hotels: ApiHotel[] }> => get('/hotels'),
  getHotel: (slug: string): Promise<{ hotel: ApiHotel }> => get(`/hotels/${slug}`),
  getTours: (): Promise<{ tours: ApiTour[] }> => get('/tours'),
  getTour: (slug: string): Promise<{ tour: ApiTour }> => get(`/tours/${slug}`),
  getVisaPackages: (): Promise<{ packages: ApiVisaPackage[] }> => get('/visa-packages'),
  getPilgrimages: (): Promise<{ pilgrimages: ApiPilgrimage[] }> => get('/pilgrimages'),
};

// ---- API shape types ----
export interface ApiRoomType { type: string; priceUSD: number; priceNGN: number; capacity: number; }

export interface ApiHotel {
  id: number; slug: string; name: string; location: string; country: string; stars: number;
  image: string | null; description: string; amenities: string[]; roomTypes: ApiRoomType[];
  distanceFromHaram: string | null; isActive: boolean; isFeatured: boolean; sortOrder: number;
}

export interface ApiTour {
  id: number; slug: string; title: string; destination: string; country: string; category: string;
  duration: string; image: string | null; description: string; highlights: string[]; includes: string[];
  priceUSD: number; priceNGN: number; departureDate: string | null; maxGroupSize: number | null;
  requiresVisa: boolean; isActive: boolean; isFeatured: boolean; sortOrder: number;
}

export interface ApiVisaPackage {
  id: number; slug: string; name: string; country: string; flag: string | null;
  image: string | null; priceUSD: number; priceNGN: number; processingTime: string;
  validity: string | null; requirements: string[]; description: string;
  isActive: boolean; isFeatured: boolean; sortOrder: number;
}

export interface ApiOccupancyOption { type: string; priceNGN: number; }

export interface ApiPilgrimage {
  id: number; slug: string; title: string; type: string; category: string;
  season: string | null; year: number | null; duration: string; image: string | null;
  description: string; features: string[]; occupancyOptions: ApiOccupancyOption[];
  priceFromNGN: number; priceFromUSD: number; isActive: boolean; isFeatured: boolean; sortOrder: number;
}
