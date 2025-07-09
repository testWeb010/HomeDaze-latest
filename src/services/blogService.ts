import { api, ApiResponse } from './api';

export interface Blog {
  _id?: string;
  title: string;
  content: string;
  author?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export const blogService = {
  getBlogs: async (): Promise<ApiResponse<Blog[]>> => api.get<Blog[]>('/api/blog'),
  getBlogById: async (id: string): Promise<ApiResponse<Blog>> => api.get<Blog>(`/api/blog/${id}`),
  createBlog: async (data: Partial<Blog>): Promise<ApiResponse<Blog>> => api.post<Blog>('/api/blog', data),
  updateBlog: async (id: string, data: Partial<Blog>): Promise<ApiResponse<Blog>> => api.put<Blog>(`/api/blog/${id}`, data),
  deleteBlog: async (id: string): Promise<ApiResponse<{ message: string }>> => api.delete<{ message: string }>(`/api/blog/${id}`),
};

export default blogService;