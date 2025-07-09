import express from 'express';
import { cookieAuth, requireRole } from '../middlewares/cookieAuth.mjs';
import { Blog } from '../models/blog.mjs';

const router = express.Router();

// Get all blogs (public endpoint)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get blog by ID (public endpoint)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new blog (authenticated users only)
router.post('/', cookieAuth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const authorId = req.user.id;
    
    const blog = new Blog({
      title,
      content,
      authorId
    });
    
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a blog (author or admin only)
router.put('/:id', cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if the requesting user is the author or admin
    if (blog.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    
    blog.title = title;
    blog.content = content;
    blog.updatedAt = new Date();
    
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a blog (author or admin only)
router.delete('/:id', cookieAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Check if the requesting user is the author or admin
    if (blog.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    
    await Blog.findByIdAndDelete(id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
