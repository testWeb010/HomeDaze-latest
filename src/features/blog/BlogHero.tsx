import React from 'react';
import { Search, BookOpen } from 'lucide-react';

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BlogHero: React.FC<BlogHeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>HomeDaze Blog</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Student Living
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Expert advice, tips, and guides to help students find the perfect accommodation and make the most of their living experience
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl focus:ring-2 focus:ring-blue-500 shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHero;
