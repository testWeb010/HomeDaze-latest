import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Membership, MembershipFormData } from '../types/membership';
import { ApiResponse } from '../types/blog';

// Base API URL
const API_URL = '/api/membership';

// Fetch all memberships
export const useMemberships = () => {
  return useQuery<Membership[], Error>({
    queryKey: ['memberships'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch a single membership by ID
export const useMembership = (membershipId: string) => {
  return useQuery<Membership, Error>({
    queryKey: ['membership', membershipId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/${membershipId}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!membershipId,
  });
};

// Fetch membership by user ID
export const useMembershipByUser = (userId: string) => {
  return useQuery<Membership, Error>({
    queryKey: ['membershipByUser', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/user/${userId}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
  });
};

// Purchase or update membership
export const useUpdateMembership = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Membership>, Error, MembershipFormData>({
    mutationFn: async (data: MembershipFormData) => {
      const response = await axios.post(`${API_URL}/update`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate memberships query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      // Also invalidate specific user membership if userId is available
      if (variables.userId) {
        queryClient.invalidateQueries({ queryKey: ['membershipByUser', variables.userId] });
      }
    },
  });
};

// Cancel membership
export const useCancelMembership = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (userId: string) => {
      const response = await axios.post(`${API_URL}/cancel/${userId}`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      // Invalidate memberships query and specific user membership
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      queryClient.invalidateQueries({ queryKey: ['membershipByUser', userId] });
    },
  });
};
