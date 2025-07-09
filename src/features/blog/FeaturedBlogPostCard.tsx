import React from 'react';
import { ArrowRight, Heart, Share2, Clock } from 'lucide-react';
import { BlogPost } from '../../types';

interface FeaturedBlogPostCardProps {
  post: BlogPost;
  index: number;
  formatDate: (dateString: string) => string;
}

const FeaturedBlogPostCard: React.FC<FeaturedBlogPostCardProps> = ({ post, index, formatDate }) => {
  return (
    <div key={post.id} className={`group ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
        <div className="relative">
          <img
            src={post.image}
            alt={post.title}
            className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              index === 0 ? 'h-80' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
              <Share2 className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors ${
            index === 0 ? 'text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>

          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">{formatDate(post.publishedAt)}</p>
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

export default FeaturedBlogPostCard;