// src/api/authApi.ts

import axios from 'axios';

// Define types for request and response data
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: any;
}

interface SignInPayload {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface SendOtpPayload {
  phone: string;
}

// Base API URL
const API_BASE_URL = '/api/auth';

// Create axios instance with credentials enabled for cookies
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Calls the sign-in API endpoint.
 * @param payload - User credentials (email/password or phone/otp).
 * @returns A promise resolving to the authentication response.
 */
export const signIn = async (payload: SignInPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/login', payload);
    return response.data;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.response?.data?.message || 'Sign in failed');
  }
};

/**
 * Calls the sign-up API endpoint.
 * @param payload - User registration details.
 * @returns A promise resolving to the authentication response.
 */
export const signUp = async (payload: SignUpPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/register', payload);
    return response.data;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.response?.data?.message || 'Sign up failed');
  }
};

/**
 * Calls the forgot password API endpoint to request a reset link.
 * @param payload - User's email address.
 * @returns A promise resolving to the authentication response.
 */
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/forgot-password', payload);
    return response.data;
  } catch (error: any) {
    console.error('Forgot password error:', error);
    throw new Error(error.response?.data?.message || 'Password reset request failed');
  }
};

/**
 * Calls the API endpoint to send an OTP to a phone number.
 * @param payload - User's phone number.
 * @returns A promise resolving to the authentication response.
 */
export const sendOtp = async (payload: SendOtpPayload): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/send-otp', payload);
    return response.data;
  } catch (error: any) {
    console.error('Send OTP error:', error);
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

/**
 * Handles social authentication initiation.
 * @param provider - The social auth provider (e.g., 'google', 'facebook').
 * @returns void (typically redirects user or opens a popup)
 */
export const socialAuth = (provider: 'google' | 'facebook' | 'linkedin' | 'twitter'): void => {
  // Redirect to backend social auth route
  window.location.href = `/api/auth/${provider}`;
};

/**
 * Logout user by clearing the authentication cookie
 * @returns A promise resolving to the logout response
 */
export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};
