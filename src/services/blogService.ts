import api from './api';
import { Blog, BlogFormData, ApiResponse } from '../types/blog';

// Fetch all blogs
export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await api.get('/api/posts/getpost');
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Fetch a single blog by ID
export const getBlogById = async (blogId: string): Promise<Blog> => {
  try {
    const response = await api.get(`/api/posts/get-post-by-id/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blog with ID ${blogId}:`, error);
    throw error;
  }
};

// Fetch blogs by user ID
export const getBlogsByUser = async (userId: string): Promise<Blog[]> => {
  try {
    const response = await api.get(`/api/posts/get-post-by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blogs for user ${userId}:`, error);
    throw error;
  }
};

// Create a new blog
export const createBlog = async (blogData: BlogFormData): Promise<ApiResponse<Blog>> => {
  try {
    const response = await api.post('/api/posts/addpost', blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw error;
  }
};

// Update an existing blog
export const updateBlog = async (blogId: string, blogData: BlogFormData): Promise<ApiResponse<Blog>> => {
  try {
    const response = await api.put(`/api/posts/edit-post/${blogId}`, blogData);
    return response.data;
  } catch (error) {
    console.error(`Error updating blog with ID ${blogId}:`, error);
    throw error;
  }
};

// Delete a blog
export const deleteBlog = async (blogId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/api/posts/delete-post/${blogId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting blog with ID ${blogId}:`, error);
    throw error;
  }
};
