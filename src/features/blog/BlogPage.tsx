
import React, { useState } from 'react';
import BlogHero from './BlogHero';
import FeaturedPosts from './FeaturedPosts';
import ArticleGrid from './ArticleGrid';
import BlogSidebarCategories from './BlogSidebarCategories';
import { BlogPost } from '../../types';

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for blog posts
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'ultimate-guide-to-student-housing',
      title: 'Ultimate Guide to Student Housing',
      excerpt: 'Everything you need to know about finding the perfect student accommodation.',
      content: '',
      author: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Housing Expert'
      },
      publishedAt: '2024-01-15',
      category: 'student-guide',
      tags: ['housing', 'students', 'guide'],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      featured: true,
      readTime: 8
    },
    {
      id: '2',
      slug: 'safety-tips-for-living-away-from-home',
      title: 'Safety Tips for Living Away from Home',
      excerpt: 'Essential safety guidelines for students living independently.',
      content: '',
      author: {
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'Safety Consultant'
      },
      publishedAt: '2024-01-12',
      category: 'safety',
      tags: ['safety', 'tips', 'independent-living'],
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      featured: true,
      readTime: 6
    },
    {
      id: '3',
      slug: 'budget-friendly-housing-solutions',
      title: 'Budget-Friendly Housing Solutions',
      excerpt: 'How to find affordable accommodation without compromising on quality.',
      content: '',
      author: {
        name: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Financial Advisor'
      },
      publishedAt: '2024-01-10',
      category: 'budget-guide',
      tags: ['budget', 'affordable', 'housing'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      featured: true,
      readTime: 5
    }
  ];

  // Utility function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Filter posts based on selected category and search query
  const filteredPosts = mockPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = mockPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BlogHero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="max-w-7xl mx-auto">
        <FeaturedPosts 
          featuredPosts={featuredPosts}
          formatDate={formatDate}
        />
        
        <div className="flex">
          {/* Sidebar */}
          <BlogSidebarCategories 
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            <ArticleGrid 
              posts={filteredPosts}
              formatDate={formatDate}
              selectedCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
