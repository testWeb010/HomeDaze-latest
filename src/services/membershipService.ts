import { api, ApiResponse } from './api';

export interface Membership {
  _id?: string;
  name: string;
  price: number;
  features: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const membershipService = {
  getMemberships: async (): Promise<ApiResponse<Membership[]>> => api.get<Membership[]>('/api/membership'),
  createMembership: async (data: Partial<Membership>): Promise<ApiResponse<Membership>> => api.post<Membership>('/api/membership', data),
  updateMembership: async (id: string, data: Partial<Membership>): Promise<ApiResponse<Membership>> => api.put<Membership>(`/api/membership/${id}`, data),
  deleteMembership: async (id: string): Promise<ApiResponse<{ message: string }>> => api.delete<{ message: string }>(`/api/membership/${id}`),
};

export default membershipService;