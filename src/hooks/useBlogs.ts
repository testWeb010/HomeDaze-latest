import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Base API URL
const API_URL = '/api/blogs';

// Interface for blog data structure
interface Blog {
  _id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch all blogs
export const useBlogs = () => {
  return useQuery<Blog[]>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await axios.get(API_URL);
      return response.data;
    },
  });
};

// Fetch a single blog by ID
export const useBlogById = (id: string) => {
  return useQuery<Blog>({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    },
  });
};

// Create a new blog
export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation<Blog, Error, Omit<Blog, '_id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (newBlog) => {
      const response = await axios.post(API_URL, newBlog);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
  });
};

// Update an existing blog
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  return useMutation<Blog, Error, { id: string; data: Partial<Blog> }>({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', variables.id] });
    },
  });
};

// Delete a blog
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
    },
  });
};
