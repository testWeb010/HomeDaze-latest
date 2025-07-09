
import React from 'react';
import { Tag, TrendingUp, Clock, Users, Home, Heart, Shield, DollarSign } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface BlogSidebarCategoriesProps {
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const BlogSidebarCategories: React.FC<BlogSidebarCategoriesProps> = ({ 
  activeCategory = 'all',
  onCategoryChange 
}) => {
  const categories: Category[] = [
    { name: 'All Articles', count: 24, icon: Tag, color: 'text-blue-600' },
    { name: 'Student Guide', count: 8, icon: Users, color: 'text-green-600' },
    { name: 'Safety', count: 6, icon: Shield, color: 'text-red-600' },
    { name: 'Legal Guide', count: 4, icon: Clock, color: 'text-purple-600' },
    { name: 'Budget Guide', count: 6, icon: DollarSign, color: 'text-yellow-600' },
    { name: 'Tips & Tricks', count: 12, icon: TrendingUp, color: 'text-orange-600' },
    { name: 'Lifestyle', count: 8, icon: Heart, color: 'text-pink-600' },
    { name: 'Housing', count: 10, icon: Home, color: 'text-indigo-600' }
  ];

  const recentPosts = [
    {
      title: 'The Future of JavaScript Development',
      date: 'January 15, 2024',
      readTime: '5 min read'
    },
    {
      title: '10 CSS Tips and Tricks for Better UI',
      date: 'January 12, 2024', 
      readTime: '3 min read'
    },
    {
      title: 'Understanding React Server Components',
      date: 'January 10, 2024',
      readTime: '7 min read'
    }
  ];

  const tags = [
    'Web Development', 'Mobile Development', 'UI/UX Design', 'Marketing',
    'SEO', 'JavaScript', 'React', 'Node.js', 'CSS', 'HTML'
  ];

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6 space-y-8">
      {/* Search */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.name.toLowerCase().replace(/\s+/g, '-');
            
            return (
              <button
                key={category.name}
                onClick={() => onCategoryChange?.(category.name.toLowerCase().replace(/\s+/g, '-'))}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? category.color : 'text-gray-400'}`} />
                <span className="flex-1 font-medium">{category.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <h4 className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors text-sm leading-tight">
                {post.title}
              </h4>
              <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <button
              key={index}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebarCategories;
