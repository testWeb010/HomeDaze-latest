import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Property from '../models/Property.mjs';
import cookieAuth from '../middlewares/cookieAuth.mjs';
import { ObjectId } from "mongodb";
import { getDb } from "../db/conn.mjs";
import { validateProperty, validateSearch, validateObjectId } from "../middlewares/validation.mjs";
import { apiLimiter } from "../middlewares/rateLimiter.mjs";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'properties');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('video/')) {
      cb(null, 'public/uploads/videos/');
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image or video file!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

// Helper function to build standard response
const buildResponse = (success, data = null, message = '', error = null) => ({
  success,
  data,
  message,
  error
});

// Helper function to build pagination info
const buildPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

// GET /api/properties - Get all properties with pagination and filters
router.get("/", apiLimiter, validateSearch, async (req, res) => {
  try {
    const db = getDb().connection;
    const {
      page = 1,
      limit = 12,
      city,
      propertyType,
      genderPreference,
      minPrice,
      maxPrice,
      bedrooms,
      amenities,
      availableFrom,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      isActive = true,
      verified
    } = req.query;

    // Build filter object
    const filter = { isActive: isActive === 'true' };
    
    if (verified !== undefined) filter.verified = verified === 'true';
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (genderPreference && genderPreference !== 'any') filter.preferredGender = genderPreference;
    if (bedrooms) filter.totalRooms = Number(bedrooms);
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.totalRent = {};
      if (minPrice) filter.totalRent.$gte = Number(minPrice);
      if (maxPrice) filter.totalRent.$lte = Number(maxPrice);
    }

    // Amenities filter
    if (amenities && Array.isArray(amenities)) {
      filter.amenities = { $in: amenities };
    }

    // Available from filter
    if (availableFrom) {
      filter.availableFrom = { $lte: new Date(availableFrom) };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { propertyName: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Get properties with user details
    const properties = await db.collection("properties")
      .aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              { 
                $project: { 
                  name: 1, 
                  email: 1, 
                  profilePicture: 1, 
                  phone: 1, 
                  verified: 1,
                  rating: 1
                } 
              }
            ]
          }
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: Number(limit) },
        {
          $project: {
            _id: 1,
            userId: 1,
            propertyName: 1,
            description: 1,
            propertyType: 1,
            totalRooms: 1,
            totalRent: 1,
            deposit: 1,
            availableFrom: 1,
            address: 1,
            city: 1,
            state: 1,
            zipCode: 1,
            country: 1,
            location: 1,
            images: 1,
            videos: 1,
            amenities: 1,
            preferredGender: 1,
            verified: 1,
            featured: 1,
            isActive: 1,
            rating: 1,
            views: 1,
            rules: 1,
            nearbyPlaces: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: { $arrayElemAt: ["$owner", 0] }
          }
        }
      ])
      .toArray();

    // Get total count for pagination
    const total = await db.collection("properties").countDocuments(filter);
    const pagination = buildPagination(page, limit, total);

    res.json(buildResponse(true, { data: properties, ...pagination }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch properties", error.message));
  }
});

// GET /api/properties/:id - Get property by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;

    const property = await db.collection("properties")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              { 
                $project: { 
                  name: 1, 
                  email: 1, 
                  profilePicture: 1, 
                  phone: 1, 
                  verified: 1,
                  rating: 1
                } 
              }
            ]
          }
        },
        {
          $lookup: {
            from: "bookings",
            localField: "_id",
            foreignField: "propertyId",
            as: "bookings",
            pipeline: [
              { $match: { status: { $in: ["confirmed", "pending"] } } },
              { $project: { checkInDate: 1, checkOutDate: 1, status: 1 } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            propertyName: 1,
            description: 1,
            propertyType: 1,
            totalRooms: 1,
            totalRent: 1,
            deposit: 1,
            availableFrom: 1,
            address: 1,
            city: 1,
            state: 1,
            zipCode: 1,
            country: 1,
            location: 1,
            images: 1,
            videos: 1,
            amenities: 1,
            preferredGender: 1,
            verified: 1,
            featured: 1,
            isActive: 1,
            rating: 1,
            views: 1,
            rules: 1,
            nearbyPlaces: 1,
            reviews: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: { $arrayElemAt: ["$owner", 0] }
          }
        }
      ])
      .toArray();

    if (!property.length) {
      return res.status(404).json(buildResponse(false, null, "Property not found"));
    }

    res.json(buildResponse(true, property[0]));
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch property", error.message));
  }
});

// Middleware to check if user owns the property or is admin
const requirePropertyOwnership = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      return next();
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not have permission to modify this property' });
    }

    next();
  } catch (error) {
    console.error('Error checking property ownership:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a single property by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get properties by user ID
router.get('/user/:userId', cookieAuth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user can access this data (self or admin)
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access to user properties' });
    }

    const properties = await Property.find({ ownerId: userId });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create a new property
router.post('/', cookieAuth, async (req, res) => {
  try {
    const { title, description, price, location, images, videos } = req.body;
    const ownerId = req.user.id;

    const property = new Property({
      title,
      description,
      price,
      location,
      images,
      videos,
      ownerId
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a property
router.put('/:id', cookieAuth, requirePropertyOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, location, images, videos } = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      { title, description, price, location, images, videos },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a property
router.delete('/:id', cookieAuth, requirePropertyOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByIdAndDelete(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Clean up associated files if necessary
    if (property.images && property.images.length > 0) {
      property.images.forEach(imagePath => {
        const fullPath = path.join(uploadDir, path.basename(imagePath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    if (property.videos && property.videos.length > 0) {
      property.videos.forEach(videoPath => {
        const fullPath = path.join(uploadDir, path.basename(videoPath));
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Toggle property status (active/inactive)
router.patch('/:id/status', cookieAuth, requirePropertyOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const property = await Property.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error toggling property status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Upload media for a property
router.post('/:id/media', cookieAuth, requirePropertyOwnership, upload.array('media', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const imageUrls = [];
    const videoUrls = [];

    files.forEach(file => {
      const fileUrl = `/uploads/properties/${file.filename}`;
      if (file.mimetype.startsWith('image/')) {
        imageUrls.push(fileUrl);
      } else if (file.mimetype.startsWith('video/')) {
        videoUrls.push(fileUrl);
      }
    });

    if (imageUrls.length > 0) {
      property.images = [...(property.images || []), ...imageUrls];
    }
    if (videoUrls.length > 0) {
      property.videos = [...(property.videos || []), ...videoUrls];
    }

    await property.save();
    res.status(200).json(property);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
