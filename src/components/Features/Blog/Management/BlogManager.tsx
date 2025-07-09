import React, { useState, useEffect } from 'react';
import { useBlogs, useBlogById, useCreateBlog, useUpdateBlog, useDeleteBlog } from '../../../../hooks/useBlogs';

interface Blog {
  _id?: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface BlogManagerProps {
  userId: string;
  isAdmin?: boolean;
}

const BlogManager: React.FC<BlogManagerProps> = ({ userId, isAdmin = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  
  // Fetch blog data
  const { data: blogs, isLoading: isLoadingBlogs, error: blogsError } = useBlogs();
  const { data: editingBlog, isLoading: isLoadingEditingBlog } = useBlogById(editingBlogId || '');
  
  // Mutation hooks
  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  
  useEffect(() => {
    if (editingBlog && editingBlogId) {
      setTitle(editingBlog.title);
      setContent(editingBlog.content);
    }
  }, [editingBlog, editingBlogId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBlogId) {
        await updateBlogMutation.mutateAsync({
          id: editingBlogId,
          data: { title, content }
        });
        setEditingBlogId(null);
      } else {
        await createBlogMutation.mutateAsync({
          title,
          content,
          authorId: userId
        });
      }
      setTitle('');
      setContent('');
      alert(editingBlogId ? 'Blog updated successfully' : 'Blog created successfully');
    } catch (error) {
      console.error('Error submitting blog:', error);
      alert(editingBlogId ? 'Failed to update blog' : 'Failed to create blog');
    }
  };
  
  const handleEdit = (blog: Blog) => {
    setEditingBlogId(blog._id || '');
  };
  
  const handleDelete = async (blog: Blog) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      if (blog._id) {
        await deleteBlogMutation.mutateAsync(blog._id);
        alert('Blog deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };
  
  if (isLoadingBlogs) {
    return <div>Loading blogs...</div>;
  }
  
  if (blogsError) {
    return <div>Error loading blogs: {blogsError.message}</div>;
  }
  
  return (
    <div className="blog-manager p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Blog Management</h2>
      
      {/* Blog creation/editing form */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">{editingBlogId ? 'Edit Blog' : 'Create New Blog'}</h3>
        {isLoadingEditingBlog && editingBlogId && <div>Loading blog data for editing...</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content:</label>
            <textarea
              id="content"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={createBlogMutation.isPending || updateBlogMutation.isPending}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${(createBlogMutation.isPending || updateBlogMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {createBlogMutation.isPending || updateBlogMutation.isPending ? 'Submitting...' : editingBlogId ? 'Update Blog' : 'Create Blog'}
          </button>
        </form>
      </div>
      
      {/* Blog list */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Blogs</h3>
        {blogs && blogs.length > 0 ? (
          <div className="space-y-4">
            {blogs.map((blog: Blog) => (
              <div key={blog._id} className="p-4 border rounded-md">
                <h4 className="text-xl font-semibold">{blog.title}</h4>
                <p className="text-gray-600">{blog.content.slice(0, 200)}...</p>
                <p className="text-sm text-gray-500">Posted on: {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'N/A'}</p>
                {(blog.authorId === userId || isAdmin) && (
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
                      disabled={deleteBlogMutation.isPending}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${deleteBlogMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogManager;
