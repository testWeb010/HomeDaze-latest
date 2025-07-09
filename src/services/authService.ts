import { api, ApiResponse } from './api';
import { User } from '../types';

// Auth request/response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  terms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface GoogleAuthResponse {
  url: string;
}

// Authentication API endpoints
export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/api/auth/register', data);
  },

  // Login user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/api/auth/login', data);
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }
  },

  // Verify email
  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse<{ message: string }>> => {
    return api.post('/api/auth/verify-email', data);
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return api.post('/api/auth/forgot-password', data);
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return api.post('/api/auth/reset-password', data);
  },

  // Change password (authenticated user)
  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> => {
    return api.put('/api/users/change-password', data);
  },

  // Google OAuth - get auth URL
  getGoogleAuthUrl: async (): Promise<ApiResponse<GoogleAuthResponse>> => {
    return api.get('/api/auth/google');
  },

  // Google OAuth - handle callback
  handleGoogleAuth: async (code: string): Promise<ApiResponse<AuthResponse>> => {
    return api.post('/api/auth/google/callback', { code });
  },

  // Refresh token - Not needed with cookie-based auth as server handles it
  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return api.post('/api/auth/refresh', {});
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>('/api/users/me');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const response = await api.get<{ authenticated: boolean }>('/api/auth/check');
      return response.success && response.data.authenticated === true;
    } catch (error) {
      return false;
    }
  },

  // Get auth token - Not needed with cookie-based auth as cookies are sent automatically
  getToken: (): string | null => {
    // This method is kept for compatibility but isn't used with cookie auth
    return null;
  },

  // Check username availability
  checkUsername: async (username: string): Promise<ApiResponse<{ available: boolean }>> => {
    return api.get('/api/users/check-username', { username });
  },

  // Resend verification email
  resendVerification: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    return api.post('/api/auth/resend-verification', { email });
  },
};