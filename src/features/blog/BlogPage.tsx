
import React, { useState, useEffect } from 'react';
import BlogHero from './BlogHero';
import FeaturedPosts from './FeaturedPosts';
import ArticleGrid from './ArticleGrid';
import BlogSidebarCategories from './BlogSidebarCategories';
import { blogService, Blog } from '../../services/blogService';
import { useAuth } from '../../hooks/useAuth';

const BlogPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [form, setForm] = useState<Partial<Blog>>({ title: '', content: '', tags: [] });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await blogService.getBlogs();
      setBlogs(res.data || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditBlog(null);
    setForm({ title: '', content: '', tags: [] });
    setShowModal(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditBlog(blog);
    setForm({ ...blog });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    try {
      await blogService.deleteBlog(id);
      fetchBlogs();
    } catch (e: any) {
      alert(e.message || 'Failed to delete blog');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editBlog) {
        await blogService.updateBlog(editBlog._id!, form);
      } else {
        await blogService.createBlog(form);
      }
      setShowModal(false);
      fetchBlogs();
    } catch (e: any) {
      alert(e.message || 'Failed to save blog');
    }
  };

  // Filter and featured logic
  const filteredPosts = blogs.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.tags?.includes(selectedCategory);
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  const featuredPosts = blogs.filter(post => post.tags?.includes('featured'));

  // Utility function to format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BlogHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="max-w-7xl mx-auto">
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCreate}
            >
              + Create Blog
            </button>
          </div>
        )}
        <FeaturedPosts
          featuredPosts={featuredPosts}
          formatDate={formatDate}
        />
        <div className="flex">
          <BlogSidebarCategories
            activeCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading blogs...</div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
              <ArticleGrid
                posts={filteredPosts}
                formatDate={formatDate}
                selectedCategory={selectedCategory}
                onEdit={isAdmin ? handleEdit : undefined}
                onDelete={isAdmin ? handleDelete : undefined}
              />
            )}
          </div>
        </div>
      </div>
      {/* Blog Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editBlog ? 'Edit Blog' : 'Create Blog'}</h2>
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Title"
              value={form.title || ''}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
            />
            <textarea
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Content"
              value={form.content || ''}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={6}
              required
            />
            <input
              className="w-full mb-3 px-3 py-2 border rounded"
              placeholder="Tags (comma separated)"
              value={form.tags?.join(', ') || ''}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()) }))}
            />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
