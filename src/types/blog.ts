export interface Blog {
  _id?: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  tags?: string[];
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface BlogFormData {
  title: string;
  content: string;
  tags?: string[];
  images?: File[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
