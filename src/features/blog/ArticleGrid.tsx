import React from 'react';
import { BlogPost } from '../../types';
import BlogPostCard from './BlogPostCard';

interface ArticleGridProps {
  posts: BlogPost[];
  formatDate: (dateString: string) => string;
  selectedCategory: string; // Assuming this might be needed for the heading
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  posts,
  formatDate,
  selectedCategory,
}) => {
  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedCategory === 'all' ? 'All Articles' : selectedCategory}
        </h2>
        <div className="text-gray-600">
          {posts.length} articles found
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} formatDate={formatDate} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;