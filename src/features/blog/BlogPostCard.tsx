import React from 'react';
import { Calendar, Clock, Eye, ArrowRight, Edit, Trash2 } from 'lucide-react';
import { Blog } from '../../services/blogService';

interface BlogPostCardProps {
  post: Blog;
  formatDate: (dateString: string) => string;
  onEdit?: (blog: Blog) => void;
  onDelete?: (id: string) => void;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, formatDate, onEdit, onDelete }) => {
  // Placeholder for view count - will be dynamic with API
  const viewCount = Math.floor(Math.random() * 1000) + 100;

  return (
    <div key={post._id} className="group relative">
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img
            src={post.image || 'https://via.placeholder.com/800x600?text=Blog+Image'}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.tags?.[0] || 'General'}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            <Eye className="h-3 w-3" />
            <span>{viewCount}</span>
          </div>
          {(onEdit || onDelete) && (
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              {onEdit && (
                <button onClick={() => onEdit(post)} className="p-1 bg-blue-100 hover:bg-blue-200 rounded-full">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(post._id!)} className="p-1 bg-red-100 hover:bg-red-200 rounded-full">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.createdAt || '')}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.content?.slice(0, 120) || ''}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.author?.avatar || 'https://via.placeholder.com/32'}
                alt={post.author?.name || 'Author'}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{post.author?.role || ''}</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
              <span>Read More</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;