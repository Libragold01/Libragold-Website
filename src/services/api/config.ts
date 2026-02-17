// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.libragoldgroup.com/api/v1', // Update with actual API URL
  ENDPOINTS: {
    // Product endpoints
    PRODUCT: '/product',
    PRODUCT_PACKAGE: '/product/package',
    PRODUCT_BOOKING: '/product-booking',
  },
  // Default pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
};

// API Response types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  code: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helper function for API calls
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Helper for form data requests (file uploads)
export async function apiFormDataRequest<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method,
    body: formData,
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
}
