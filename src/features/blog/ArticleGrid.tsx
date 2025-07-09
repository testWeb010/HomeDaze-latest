import React from 'react';
import { Blog } from '../../services/blogService';
import BlogPostCard from './BlogPostCard';

interface ArticleGridProps {
  posts: Blog[];
  formatDate: (dateString: string) => string;
  selectedCategory: string;
  onEdit?: (blog: Blog) => void;
  onDelete?: (id: string) => void;
}

const ArticleGrid: React.FC<ArticleGridProps> = ({
  posts,
  formatDate,
  selectedCategory,
  onEdit,
  onDelete,
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
          <BlogPostCard key={post._id} post={post} formatDate={formatDate} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};

export default ArticleGrid;