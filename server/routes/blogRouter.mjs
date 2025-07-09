import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { cookieAuth } from '../middlewares/cookieAuth.mjs';
import { apiLimiter } from '../middlewares/rateLimiter.mjs';
import { getDb } from '../db/conn.mjs';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/blogs/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image file!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Validation middleware
function validateBlog(req, res, next) {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ message: "Missing required fields: title, content, and category are required" });
  }
  next();
}

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
}

// GET /api/blogs - Get all blogs
router.get('/', apiLimiter, async (req, res) => {
  try {
    const db = getDb().connection;
    const { category, sort } = req.query;
    
    let query = { status: 'published' };
    if (category) {
      query.category = category;
    }

    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'popular') {
      sortOption = { views: -1 };
    }

    const blogs = await db.collection('blogs')
      .find(query)
      .sort(sortOption)
      .limit(10)
      .toArray();
      
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/blogs/:id - Get single blog
router.get('/:id', apiLimiter, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    
    const blog = await db.collection('blogs').findOne({ 
      _id: new ObjectId(id),
      status: 'published' 
    });
    
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Increment views
    await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );
    
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/blogs - Create new blog
router.post('/', cookieAuth, upload.single('coverImage'), validateBlog, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = new ObjectId(req.user.id);
    
    // Check if user has permission to create blog
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
      return res.status(403).json({ message: "Unauthorized: Only admins and editors can create blogs" });
    }
    
    const blogData = {
      ...req.body,
      coverImage: req.file ? `/uploads/blogs/${req.file.filename}` : '',
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: req.user.role === 'admin' ? 'published' : 'draft',
      views: 0,
      comments: []
    };
    
    const result = await db.collection('blogs').insertOne(blogData);
    
    res.status(201).json({
      message: "Blog created successfully",
      blogId: result.insertedId,
      status: blogData.status
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /api/blogs/:id - Update blog
router.put('/:id', cookieAuth, upload.single('coverImage'), validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);
    
    // Check if blog exists
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Check permission
    if (!blog.userId.equals(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to update this blog" });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.coverImage = `/uploads/blogs/${req.file.filename}`;
    }
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Blog updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update blog" });
    }
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/blogs/:id - Delete blog
router.delete('/:id', cookieAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);
    
    // Check if blog exists
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    
    // Check permission
    if (!blog.userId.equals(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized to delete this blog" });
    }
    
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Blog deleted successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete blog" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/blogs/:id/publish - Publish blog
router.post('/:id/publish', cookieAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    
    // Only admin can publish
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Unauthorized: Only admins can publish blogs" });
    }
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'published', publishedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Blog published successfully" });
    } else {
      res.status(400).json({ message: "Failed to publish blog" });
    }
  } catch (error) {
    console.error("Error publishing blog:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/blogs/:id/comment - Add comment to blog
router.post('/:id/comment', cookieAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    
    const comment = {
      _id: new ObjectId(),
      userId: userId,
      content: content,
      createdAt: new Date(),
      likes: 0
    };
    
    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $push: { comments: comment } }
    );
    
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Comment added successfully", commentId: comment._id });
    } else {
      res.status(400).json({ message: "Failed to add comment" });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
