import React from 'react';
import { TrendingUp } from 'lucide-react';
import { BlogPost } from '../../types';
import FeaturedBlogPostCard from './FeaturedBlogPostCard';

interface FeaturedPostsProps {
  featuredPosts: BlogPost[];
  formatDate: (dateString: string) => string;
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({ featuredPosts, formatDate }) => {
  return (
    <section className="mb-16">
      <div className="flex items-center space-x-2 mb-8">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {featuredPosts.slice(0, 3).map((post, index) => (
          <FeaturedBlogPostCard 
            key={post.id} 
            post={post} 
            index={index} 
            formatDate={formatDate} 
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedPosts;