
import React from 'react';
import { Search, Calendar } from 'lucide-react';

interface BlogSidebarProps {
  categories: { key: string; label: string; count: number }[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Search</h3>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search articles..."
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Web Development
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Mobile Development
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Design
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Marketing
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Posts</h3>
        <ul className="space-y-4">
          <li className="flex space-x-3">
            <img
              src="https://via.placeholder.com/80"
              alt="Recent Post"
              className="w-20 h-16 object-cover rounded"
            />
            <div>
              <a href="#" className="text-gray-700 hover:text-blue-600">
                The Future of JavaScript
              </a>
              <p className="text-gray-500 text-sm">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                October 12, 2024
              </p>
            </div>
          </li>
          <li className="flex space-x-3">
            <img
              src="https://via.placeholder.com/80"
              alt="Recent Post"
              className="w-20 h-16 object-cover rounded"
            />
            <div>
              <a href="#" className="text-gray-700 hover:text-blue-600">
                CSS Tips and Tricks
              </a>
              <p className="text-gray-500 text-sm">
                <Calendar className="inline-block w-4 h-4 mr-1" />
                October 5, 2024
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlogSidebar;
