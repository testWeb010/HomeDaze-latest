import api from './api';
import { Membership, MembershipFormData } from '../types/membership';
import { ApiResponse } from '../types/blog';

// Fetch all memberships
export const getMemberships = async (): Promise<Membership[]> => {
  try {
    const response = await api.get('/api/membership');
    return response.data;
  } catch (error) {
    console.error('Error fetching memberships:', error);
    throw error;
  }
};

// Fetch a single membership by ID
export const getMembershipById = async (membershipId: string): Promise<Membership> => {
  try {
    const response = await api.get(`/api/membership/${membershipId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching membership with ID ${membershipId}:`, error);
    throw error;
  }
};

// Fetch membership by user ID
export const getMembershipByUser = async (userId: string): Promise<Membership> => {
  try {
    const response = await api.get(`/api/membership/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching membership for user ${userId}:`, error);
    throw error;
  }
};

// Update or purchase membership
export const updateMembership = async (membershipData: MembershipFormData): Promise<ApiResponse<Membership>> => {
  try {
    const response = await api.post('/api/membership/update', membershipData);
    return response.data;
  } catch (error) {
    console.error('Error updating membership:', error);
    throw error;
  }
};

// Cancel membership
export const cancelMembership = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post(`/api/membership/cancel/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling membership for user ${userId}:`, error);
    throw error;
  }
};
