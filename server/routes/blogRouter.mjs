import express from "express";
import { getDb } from "../db/conn.mjs";
import requireAuth from "../middlewares/requireAuth.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const db = getDb().connection;
    const blogs = await db.collection("blogs").find().sort({ createdAt: -1 }).toArray();
    res.status(200).json({ success: true, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch blogs", error: err.message });
  }
});

// Get single blog by ID
router.get("/:id", async (req, res) => {
  try {
    const db = getDb().connection;
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(req.params.id) });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch blog", error: err.message });
  }
});

// Create a new blog (auth required)
router.post("/", requireAuth, async (req, res) => {
  try {
    const db = getDb().connection;
    const { title, content, author, tags } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content are required" });
    const blog = {
      title,
      content,
      author: author || req.user?.username,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("blogs").insertOne(blog);
    res.status(201).json({ success: true, data: { ...blog, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create blog", error: err.message });
  }
});

// Update a blog (auth required)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDb().connection;
    const { title, content, tags } = req.body;
    const update = {
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && { tags }),
      updatedAt: new Date(),
    };
    const result = await db.collection("blogs").findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: update },
      { returnDocument: "after" }
    );
    if (!result.value) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, data: result.value });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update blog", error: err.message });
  }
});

// Delete a blog (auth required)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const db = getDb().connection;
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete blog", error: err.message });
  }
});

export default router;