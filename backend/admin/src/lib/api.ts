const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('libragold_admin_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (res.status === 401) {
    localStorage.removeItem('libragold_admin_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; admin: Admin }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  me: () => request<{ admin: Admin }>('/auth/me'),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookingsApi = {
  list: (params?: {
    service?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.service) qs.set('service', params.service);
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return request<{ bookings: Booking[]; pagination: Pagination }>(
      `/bookings?${qs.toString()}`
    );
  },

  get: (id: number) => request<{ booking: Booking }>(`/bookings/${id}`),

  updateStatus: (id: number, status: string) =>
    request<{ message: string; booking: Booking }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ─── LWA ─────────────────────────────────────────────────────────────────────

export const lwaApi = {
  list: (params?: { status?: string; search?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.search) qs.set('search', params.search);
    if (params?.page) qs.set('page', String(params.page));
    return request<{ ambassadors: LWARegistration[]; pagination: Pagination }>(
      `/lwa?${qs.toString()}`
    );
  },

  updateStatus: (id: number, status: 'active' | 'suspended') =>
    request<{ message: string; ambassador: LWARegistration }>(`/lwa/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const dashboardApi = {
  stats: () => request<DashboardStats>('/dashboard/stats'),
};

// ─── Content ─────────────────────────────────────────────────────────────────

export const contentApi = {
  list: () => request<{ items: SiteContent[]; contentMap: Record<string, string> }>('/content'),
  update: (key: string, value: string, section?: string) =>
    request<{ message: string; content: SiteContent }>(`/content/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value, section }),
    }),
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Admin {
  id: number;
  username: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  bookingRef: string;
  service: string;
  customerName: string;
  email: string;
  phone: string;
  details: Record<string, unknown>;
  status: string;
  paymentMethod?: string | null;
  referralCode?: string | null;
  amount?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LWARegistration {
  id: number;
  lwaCode: string;
  codeNumber: number;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  socialMedia?: string | null;
  howHeard: string;
  status: string;
  totalReferrals: number;
  createdAt: string;
}

export interface SiteContent {
  id: number;
  key: string;
  value: string;
  section: string;
  updatedAt: string;
}

export interface DashboardStats {
  bookings: {
    total: number;
    byStatus: Record<string, number>;
    byService: Record<string, number>;
  };
  ambassadors: {
    total: number;
    active: number;
    suspended: number;
  };
  recentBookings: Partial<Booking>[];
  recentAmbassadors: Partial<LWARegistration>[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// ─── Pilgrimages ──────────────────────────────────────────────────────────────

export interface Pilgrimage {
  id: number; slug: string; title: string; type: string; category: string;
  season: string | null; year: number | null; duration: string; image: string | null;
  description: string; features: string[]; occupancyOptions: unknown;
  priceFromNGN: number; priceFromUSD: number; isActive: boolean; isFeatured: boolean;
  sortOrder: number; createdAt: string; updatedAt: string;
}

export interface Tour {
  id: number; slug: string; title: string; destination: string; country: string;
  category: string; duration: string; image: string | null; description: string;
  highlights: string[]; includes: string[]; priceUSD: number; priceNGN: number;
  departureDate: string | null; maxGroupSize: number; requiresVisa: boolean;
  isActive: boolean; isFeatured: boolean; sortOrder: number; createdAt: string; updatedAt: string;
}

export interface Hotel {
  id: number; slug: string; name: string; location: string; country: string;
  stars: number; image: string | null; description: string; amenities: string[];
  roomTypes: unknown; distanceFromHaram: string | null;
  isActive: boolean; isFeatured: boolean; sortOrder: number; createdAt: string; updatedAt: string;
}

export interface VisaPackage {
  id: number; slug: string; name: string; country: string; flag: string | null;
  priceUSD: number; priceNGN: number; processingTime: string; validity: string | null;
  requirements: string[]; description: string;
  isActive: boolean; isFeatured: boolean; sortOrder: number; createdAt: string; updatedAt: string;
}

export interface Payment {
  id: number; bookingId: number; reference: string; amount: number; currency: string;
  method: string; status: string; lotusData: unknown; isInstallment: boolean;
  installmentNumber: number | null; installmentTotal: number | null;
  createdAt: string; updatedAt: string;
  booking?: { bookingRef: string; customerName: string; email: string; service: string; };
}

export const pilgrimagesApi = {
  list: (params?: { type?: string; active?: string }) => {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.active) qs.set('active', params.active);
    return request<{ pilgrimages: Pilgrimage[] }>(`/pilgrimages?${qs}`);
  },
  create: (data: Record<string, unknown>) =>
    request<{ message: string; pilgrimage: Pilgrimage }>('/pilgrimages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request<{ message: string; pilgrimage: Pilgrimage }>(`/pilgrimages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/pilgrimages/${id}`, { method: 'DELETE' }),
};

export const toursApi = {
  list: (params?: { category?: string; active?: string }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.active) qs.set('active', params.active);
    return request<{ tours: Tour[] }>(`/tours?${qs}`);
  },
  create: (data: Record<string, unknown>) =>
    request<{ message: string; tour: Tour }>('/tours', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request<{ message: string; tour: Tour }>(`/tours/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/tours/${id}`, { method: 'DELETE' }),
};

export const hotelsApi = {
  list: (params?: { country?: string; active?: string }) => {
    const qs = new URLSearchParams();
    if (params?.country) qs.set('country', params.country);
    if (params?.active) qs.set('active', params.active);
    return request<{ hotels: Hotel[] }>(`/hotels?${qs}`);
  },
  create: (data: Record<string, unknown>) =>
    request<{ message: string; hotel: Hotel }>('/hotels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request<{ message: string; hotel: Hotel }>(`/hotels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/hotels/${id}`, { method: 'DELETE' }),
};

export const visaPackagesApi = {
  list: (params?: { active?: string }) => {
    const qs = new URLSearchParams();
    if (params?.active) qs.set('active', params.active);
    return request<{ packages: VisaPackage[] }>(`/visa-packages?${qs}`);
  },
  create: (data: Record<string, unknown>) =>
    request<{ message: string; package: VisaPackage }>('/visa-packages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    request<{ message: string; package: VisaPackage }>(`/visa-packages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<{ message: string }>(`/visa-packages/${id}`, { method: 'DELETE' }),
};

export const paymentsApi = {
  list: (params?: { status?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    return request<{ payments: Payment[]; pagination: Pagination }>(`/payments?${qs}`);
  },
};
