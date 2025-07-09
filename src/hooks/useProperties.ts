import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Property } from '../types'; // Import Property interface

// Base API URL
const API_URL = '/api/properties';

// Property hooks
interface PropertiesResponse {
  data: Property[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export function useProperties(params: any = {}) {
  return useQuery<PropertiesResponse>({
    queryKey: ['properties', params],
    queryFn: async () => {
      const response = await axios.get(API_URL, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProperties(limit: number = 6) {
  return useQuery<Property[]>({
    queryKey: ['featuredProperties', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/featured`, { params: { limit } });
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

export function usePopularProperties(limit: number = 10) {
  return useQuery<Property[]>({
    queryKey: ['popularProperties', limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/popular`, { params: { limit } });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function usePropertiesByLocation(city: string, params: any = {}) {
  return useQuery<Property[]>({
    queryKey: ['propertiesByLocation', city, params],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/location/${city}`, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserProperties(userId?: string) {
  return useQuery<Property[]>({
    queryKey: ['userProperties', userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/user/${userId || ''}`);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, Omit<Property, '_id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: (data: any) => axios.post(API_URL, data).then(res => res.data),
    onSuccess: (data) => {
      console.log('Property created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, { id: string; data: Partial<Property> }>({
    mutationFn: ({ id, data }: { id: string; data: any }) => axios.put(`${API_URL}/${id}`, data).then(res => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}`).then(res => res.data),
    onSuccess: (_, id) => {
      console.log('Property deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useTogglePropertyStatus() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, { id: string; activate: boolean }>({
    mutationFn: async ({ id, activate }) => {
      const response = await axios.patch(`${API_URL}/${id}/status`, { active: activate });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      console.log('Property status toggled successfully');
    },
  });
}

export function useUploadPropertyMedia() {
  const queryClient = useQueryClient();
  return useMutation<Property, Error, { id: string; images: File[] }>({
    mutationFn: ({ id, images }: { id: string; images: File[] }) => {
      const formData = new FormData();
      images.forEach(file => formData.append('media', file));
      return axios.post(`${API_URL}/${id}/media`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then(res => res.data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
    },
  });
}

export function useUniqueCities() {
  return useQuery<string[]>({
    queryKey: ['uniqueCities'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/unique-cities`);
      return response.data;
    },
    staleTime: Infinity, // Cache indefinitely as cities rarely change
  });
}

export function useSearchProperties() {
  return useMutation<Property[], Error, any>({
    mutationFn: (filters: any) => axios.post(`${API_URL}/search`, filters).then(res => res.data),
  });
}

export function useDebouncedPropertySearch() {
  const queryClient = useQueryClient();
  return useMutation<Property[], Error, any>({
    mutationFn: async (filters: any) => {
      // Debounce the search to prevent excessive API calls
      await new Promise<void>((resolve) => setTimeout(resolve, 500 as number));
      return axios.post(`${API_URL}/search`, filters).then(res => res.data);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['filteredProperties', variables], data);
    },
  });
}

export function usePropertyStats() {
  return useQuery<any>({
    queryKey: ['propertyStats'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
}

export function usePropertiesNearby() {
  return useMutation<any, Error, { lat: number; lng: number; radius?: number }>({
    mutationFn: ({ lat, lng, radius }: { lat: number; lng: number; radius?: number }) => axios.get(`${API_URL}/nearby`, { params: { lat, lng, radius } }).then(res => res.data),
  });
}

export function useReportProperty() {
  return useMutation<any, Error, { id: string; reason: string; description?: string }>({
    mutationFn: ({ id, reason, description }: { id: string; reason: string; description?: string }) => axios.post(`${API_URL}/${id}/report`, { reason, description }).then(res => res.data),
    onSuccess: () => {
      console.log('Property reported successfully');
    },
  });
}

export function useBookmarkProperty() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: (id: string) => axios.post(`${API_URL}/${id}/bookmark`).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userBookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, string>({
    mutationFn: (id: string) => axios.delete(`${API_URL}/${id}/bookmark`).then(res => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['userBookmarks'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
    },
  });
}

export function useUserBookmarks() {
  return useQuery<Property[]>({
    queryKey: ['userBookmarks'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/bookmarks`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useContactOwner() {
  return useMutation<any, Error, { propertyId: string; message: string }>({
    mutationFn: ({ propertyId, message }: { propertyId: string; message: string }) => axios.post(`${API_URL}/${propertyId}/contact`, { message }).then(res => res.data),
    onSuccess: () => {
      console.log('Message sent to owner successfully');
    },
  });
}

export function useScheduleVisit() {
  return useMutation<any, Error, { propertyId: string; date: string; time: string; message?: string }>({
    mutationFn: ({ propertyId, date, time, message }: { propertyId: string; date: string; time: string; message?: string }) => axios.post(`${API_URL}/${propertyId}/schedule`, { date, time, message }).then(res => res.data),
    onSuccess: () => {
      console.log('Visit scheduled successfully');
    },
  });
}

export function useRateProperty() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { id: string; rating: number; review?: string }>({
    mutationFn: ({ id, rating, review }: { id: string; rating: number; review?: string }) => axios.post(`${API_URL}/${id}/rate`, { rating, review }).then(res => res.data),
    onSuccess: (_, variables) => {
      console.log('Property rated successfully');
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['propertyReviews', variables.id] });
    },
  });
}

export function usePropertyReviews(propertyId: string) {
  return useQuery<any>({
    queryKey: ['propertyReviews', propertyId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(`${API_URL}/${propertyId}/reviews`, { params: { page: pageParam, limit: 10 } });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!propertyId,
  });
}

export function useSimilarProperties(propertyId: string, limit: number = 5) {
  return useQuery<Property[]>({
    queryKey: ['similarProperties', propertyId, limit],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/${propertyId}/similar`, { params: { limit } });
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useIncrementViews() {
  return useMutation<any, Error, string>({
    mutationFn: (id: string) => axios.post(`${API_URL}/${id}/views`).then(res => res.data),
  });
}

// Combined property management hook
export function usePropertyManagement() {
  const createProperty = useCreateProperty();
  const updateProperty = useUpdateProperty();
  const deleteProperty = useDeleteProperty();
  const toggleStatus = useTogglePropertyStatus();
  const uploadMedia = useUploadPropertyMedia();

  const handleCreate = useCallback(async (data: any) => {
    return await createProperty.mutateAsync(data);
  }, [createProperty]);

  const handleUpdate = useCallback(async (id: string, data: any) => {
    return await updateProperty.mutateAsync({ id, data });
  }, [updateProperty]);

  const handleDelete = useCallback(async (id: string) => {
    return await deleteProperty.mutateAsync(id);
  }, [deleteProperty]);

  const handleToggleStatus = useCallback(async (id: string, activate: boolean) => {
    return await toggleStatus.mutateAsync({ id, activate });
  }, [toggleStatus]);

  const handleUploadMedia = useCallback(async (id: string, images: File[]) => {
    return await uploadMedia.mutateAsync({ id, images });
  }, [uploadMedia]);

  return {
    create: {
      execute: handleCreate,
      loading: createProperty.isPending,
      error: createProperty.error,
      success: createProperty.isSuccess,
    },
    update: {
      execute: handleUpdate,
      loading: updateProperty.isPending,
      error: updateProperty.error,
      success: updateProperty.isSuccess,
    },
    delete: {
      execute: handleDelete,
      loading: deleteProperty.isPending,
      error: deleteProperty.error,
      success: deleteProperty.isSuccess,
    },
    toggleStatus: {
      execute: handleToggleStatus,
      loading: toggleStatus.isPending,
      error: toggleStatus.error,
      success: toggleStatus.isSuccess,
    },
    uploadMedia: {
      execute: handleUploadMedia,
      loading: uploadMedia.isPending,
      error: uploadMedia.error,
      success: uploadMedia.isSuccess,
    },
  };
}

// Property filter hook
export function usePropertyFilters() {
  const searchProperties = useSearchProperties();
  const debouncedSearch = useDebouncedPropertySearch();

  const handleFilterChange = useCallback((filters: any) => {
    debouncedSearch.mutate(filters);
  }, [debouncedSearch]);

  const handleImmediateSearch = useCallback((filters: any) => {
    searchProperties.mutate(filters);
  }, [searchProperties]);

  return {
    search: handleImmediateSearch,
    debouncedSearch: handleFilterChange,
    results: searchProperties.data || debouncedSearch.data,
    loading: searchProperties.isPending || debouncedSearch.isPending,
    error: searchProperties.error || debouncedSearch.error,
  };
}