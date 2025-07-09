import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL environment variable not set. Using default localhost:3001. Ensure this is updated for production.');
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - No need to manually add token with cookie auth
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const customError: ApiError = {
      message: 'An error occurred',
      statusCode: error.response?.status || 500,
      details: error.response?.data,
    };

    const status = error.response?.status;
    const responseData = error.response?.data as any;

    if (status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
      customError.message = 'Session expired. Please login again.';
    } else if (status === 403) {
      customError.message = 'Access denied.';
    } else if (status === 404) {
      customError.message = 'Resource not found.';
    } else if (status === 422) {
      customError.message = 'Validation error.';
    } else if (status && status >= 500) {
      customError.message = 'Server error. Please try again later.';
    } else if (error.code === 'ECONNABORTED') {
      customError.message = 'Request timeout. Please try again.';
    } else if (!error.response) {
      customError.message = 'Network error. Please check your connection.';
    } else {
      customError.message = responseData?.message || error.message;
    }

    return Promise.reject(customError);
  }
);

// Generic API methods
export const api = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> =>
    apiClient.get(url, { params }).then((res) => res.data),

  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    apiClient.post(url, data).then((res) => res.data),

  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    apiClient.put(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    apiClient.patch(url, data).then((res) => res.data),

  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    apiClient.delete(url).then((res) => res.data),

  upload: <T>(url: string, formData: FormData): Promise<ApiResponse<T>> =>
    apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => res.data),
};

// Utility functions
export const handleApiError = (error: ApiError): string => {
  console.error('API Error:', error);
  return error.message;
};

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error.message === 'string' && typeof error.statusCode === 'number';
};

export default apiClient;