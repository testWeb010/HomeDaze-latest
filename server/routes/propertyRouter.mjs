
import express from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db/conn.mjs";
import requireAuth from "../middlewares/requireAuth.mjs";
import { validateProperty, validateSearch, validateObjectId } from "../middlewares/validation.mjs";
import { apiLimiter } from "../middlewares/rateLimiter.mjs";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

const router = express.Router();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'homedaze/properties/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'webm', 'mov'],
      };
    }
    return {
      folder: 'homedaze/properties',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }],
    };
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for video
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
                  phone: 1,
                  avatar: 1,
                  verified: 1,
                  membershipTier: 1
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
            propertyName: 1,
            description: 1,
            city: 1,
            pincode: 1,
            propertyType: 1,
            totalRooms: 1,
            totalRent: 1,
            securityMoney: 1,
            preferredGender: 1,
            images: 1,
            amenities: 1,
            isActive: 1,
            verified: 1,
            featured: 1,
            views: 1,
            availableFrom: 1,
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
                  phone: 1,
                  avatar: 1,
                  verified: 1,
                  membershipTier: 1,
                  responseTime: 1,
                  rating: 1
                } 
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            propertyName: 1,
            description: 1,
            city: 1,
            pincode: 1,
            propertyType: 1,
            totalRooms: 1,
            totalRent: 1,
            securityMoney: 1,
            preferredGender: 1,
            images: 1,
            amenities: 1,
            isActive: 1,
            verified: 1,
            featured: 1,
            views: 1,
            availableFrom: 1,
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

// GET /api/properties/featured - Get featured properties
router.get("/featured", async (req, res) => {
  try {
    const db = getDb().connection;
    const { limit = 6 } = req.query;

    const properties = await db.collection("properties")
      .aggregate([
        { 
          $match: { 
            isActive: true, 
            verified: true, 
            featured: true 
          } 
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              { $project: { name: 1, verified: 1, responseTime: 1, rating: 1 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
        { $limit: Number(limit) },
        {
          $project: {
            _id: 1,
            propertyName: 1,
            city: 1,
            totalRent: 1,
            totalRooms: 1,
            preferredGender: 1,
            images: 1,
            verified: 1,
            featured: 1,
            views: 1,
            availableFrom: 1,
            owner: { $arrayElemAt: ["$owner", 0] }
          }
        }
      ])
      .toArray();

    res.json(buildResponse(true, properties));
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch featured properties", error.message));
  }
});

// GET /api/properties/popular - Get popular properties
router.get("/popular", async (req, res) => {
  try {
    const db = getDb().connection;
    const { limit = 10 } = req.query;

    const properties = await db.collection("properties")
      .find({ 
        isActive: true, 
        verified: true 
      })
      .sort({ views: -1, createdAt: -1 })
      .limit(Number(limit))
      .toArray();

    res.json(buildResponse(true, properties));
  } catch (error) {
    console.error("Error fetching popular properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch popular properties", error.message));
  }
});

// GET /api/properties/location/:city - Get properties by location
router.get("/location/:city", validateSearch, async (req, res) => {
  try {
    const db = getDb().connection;
    const { city } = req.params;
    const {
      page = 1,
      limit = 12,
      propertyType,
      genderPreference,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { 
      city: { $regex: city, $options: 'i' },
      isActive: true 
    };

    if (propertyType) filter.propertyType = propertyType;
    if (genderPreference && genderPreference !== 'any') filter.preferredGender = genderPreference;
    
    if (minPrice || maxPrice) {
      filter.totalRent = {};
      if (minPrice) filter.totalRent.$gte = Number(minPrice);
      if (maxPrice) filter.totalRent.$lte = Number(maxPrice);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await db.collection("properties")
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await db.collection("properties").countDocuments(filter);
    const pagination = buildPagination(page, limit, total);

    res.json(buildResponse(true, { data: properties, ...pagination }));
  } catch (error) {
    console.error("Error fetching properties by location:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch properties by location", error.message));
  }
});

// GET /api/properties/user/:userId - Get properties by user
router.get("/user/:userId", requireAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { userId } = req.params;

    const properties = await db.collection("properties")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(buildResponse(true, properties));
  } catch (error) {
    console.error("Error fetching user properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch user properties", error.message));
  }
});

// POST /api/properties - Create new property (support images and video)
router.post("/", requireAuth, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]), validateProperty, async (req, res) => {
  try {
    const db = getDb().connection;
    const userId = new ObjectId(req.user.id);
    const images = req.files && req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const video = req.files && req.files['video'] && req.files['video'][0] ? req.files['video'][0].path : null;
    // Extract property data
    const propertyData = {
      ...req.body,
      userId,
      images,
      video,
      isActive: true,
      verified: false,
      featured: false,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    // Convert string arrays back to arrays
    if (typeof propertyData.rules === 'string') {
      propertyData.rules = JSON.parse(propertyData.rules);
    }
    if (typeof propertyData.nearbyPlaces === 'string') {
      propertyData.nearbyPlaces = JSON.parse(propertyData.nearbyPlaces);
    }
    const result = await db.collection("properties").insertOne(propertyData);
    const property = await db.collection("properties").findOne({ _id: result.insertedId });
    res.status(201).json(buildResponse(true, property, "Property created successfully"));
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json(buildResponse(false, null, "Failed to create property", error.message));
  }
});

// PUT /api/properties/:id - Update property
router.put("/:id", requireAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);

    // Check if property exists and belongs to user
    const property = await db.collection("properties").findOne({ 
      _id: new ObjectId(id),
      userId 
    });

    if (!property) {
      return res.status(404).json(buildResponse(false, null, "Property not found or unauthorized"));
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    const updatedProperty = await db.collection("properties").findOne({ _id: new ObjectId(id) });

    res.json(buildResponse(true, updatedProperty, "Property updated successfully"));
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json(buildResponse(false, null, "Failed to update property", error.message));
  }
});

// DELETE /api/properties/:id - Delete property
router.delete("/:id", requireAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);

    const result = await db.collection("properties").deleteOne({ 
      _id: new ObjectId(id),
      userId 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json(buildResponse(false, null, "Property not found or unauthorized"));
    }

    res.json(buildResponse(true, null, "Property deleted successfully"));
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json(buildResponse(false, null, "Failed to delete property", error.message));
  }
});

// PATCH /api/properties/:id/status - Toggle property status
router.patch("/:id/status", requireAuth, validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const { activate } = req.body;
    const userId = new ObjectId(req.user.id);

    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id), userId },
      { 
        $set: { 
          isActive: activate,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json(buildResponse(false, null, "Property not found or unauthorized"));
    }

    res.json(buildResponse(true, null, `Property ${activate ? 'activated' : 'deactivated'} successfully`));
  } catch (error) {
    console.error("Error toggling property status:", error);
    res.status(500).json(buildResponse(false, null, "Failed to update property status", error.message));
  }
});

// POST /api/properties/:id/media - Upload additional media (support images and video)
router.post("/:id/media", requireAuth, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;
    const userId = new ObjectId(req.user.id);
    const imageUrls = req.files && req.files['images'] ? req.files['images'].map(file => file.path) : [];
    const videoUrl = req.files && req.files['video'] && req.files['video'][0] ? req.files['video'][0].path : null;
    const update = {
      $set: { updatedAt: new Date() },
    };
    if (imageUrls.length) {
      update.$push = { images: { $each: imageUrls } };
    }
    if (videoUrl) {
      update.$set.video = videoUrl;
    }
    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id), userId },
      update
    );
    if (result.matchedCount === 0) {
      return res.status(404).json(buildResponse(false, null, "Property not found or unauthorized"));
    }
    res.json(buildResponse(true, { images: imageUrls, video: videoUrl }, "Media uploaded successfully"));
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json(buildResponse(false, null, "Failed to upload media", error.message));
  }
});

// GET /api/properties/cities - Get unique cities
router.get("/cities", async (req, res) => {
  try {
    const db = getDb().connection;

    const cities = await db.collection("properties")
      .distinct("city", { isActive: true });

    res.json(buildResponse(true, cities.filter(city => city && city.trim())));
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch cities", error.message));
  }
});

// POST /api/properties/search - Advanced search
router.post("/search", validateSearch, async (req, res) => {
  try {
    const db = getDb().connection;
    const {
      location,
      priceRange,
      propertyType,
      genderPreference,
      amenities,
      availableFrom,
      bedrooms,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.body;

    const filter = { isActive: true };

    if (location) filter.city = { $regex: location, $options: 'i' };
    if (propertyType) filter.propertyType = propertyType;
    if (genderPreference && genderPreference !== 'any') filter.preferredGender = genderPreference;
    if (bedrooms) filter.totalRooms = Number(bedrooms);

    if (priceRange) {
      filter.totalRent = {};
      if (priceRange.min) filter.totalRent.$gte = priceRange.min;
      if (priceRange.max) filter.totalRent.$lte = priceRange.max;
    }

    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      filter.amenities = { $in: amenities };
    }

    if (availableFrom) {
      filter.availableFrom = { $lte: new Date(availableFrom) };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await db.collection("properties")
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await db.collection("properties").countDocuments(filter);
    const pagination = buildPagination(page, limit, total);

    res.json(buildResponse(true, { data: properties, ...pagination }));
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to search properties", error.message));
  }
});

// GET /api/properties/stats - Get property statistics
router.get("/stats", async (req, res) => {
  try {
    const db = getDb().connection;

    const stats = await db.collection("properties").aggregate([
      {
        $facet: {
          totalProperties: [{ $count: "count" }],
          activeProperties: [
            { $match: { isActive: true } },
            { $count: "count" }
          ],
          featuredProperties: [
            { $match: { featured: true } },
            { $count: "count" }
          ],
          verifiedProperties: [
            { $match: { verified: true } },
            { $count: "count" }
          ],
          totalViews: [
            { $group: { _id: null, total: { $sum: "$views" } } }
          ],
          averageRating: [
            { $group: { _id: null, avg: { $avg: "$rating" } } }
          ]
        }
      }
    ]).toArray();

    const result = stats[0];

    res.json(buildResponse(true, {
      totalProperties: result.totalProperties[0]?.count || 0,
      activeProperties: result.activeProperties[0]?.count || 0,
      featuredProperties: result.featuredProperties[0]?.count || 0,
      verifiedProperties: result.verifiedProperties[0]?.count || 0,
      totalViews: result.totalViews[0]?.total || 0,
      averageRating: result.averageRating[0]?.avg || 0
    }));
  } catch (error) {
    console.error("Error fetching property stats:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch property stats", error.message));
  }
});

// GET /api/properties/nearby - Get properties near location
router.get("/nearby", async (req, res) => {
  try {
    const db = getDb().connection;
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json(buildResponse(false, null, "Latitude and longitude are required"));
    }

    // For now, we'll do a simple location-based search
    // In production, you'd want to use MongoDB's geospatial features
    const properties = await db.collection("properties")
      .find({ 
        isActive: true,
        verified: true
      })
      .limit(20)
      .toArray();

    res.json(buildResponse(true, properties));
  } catch (error) {
    console.error("Error fetching nearby properties:", error);
    res.status(500).json(buildResponse(false, null, "Failed to fetch nearby properties", error.message));
  }
});

// POST /api/properties/:id/view - Increment property views
router.post("/:id/view", validateObjectId, async (req, res) => {
  try {
    const db = getDb().connection;
    const { id } = req.params;

    const result = await db.collection("properties").updateOne(
      { _id: new ObjectId(id) },
      { 
        $inc: { views: 1 },
        $set: { updatedAt: new Date() }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json(buildResponse(false, null, "Property not found"));
    }

    const property = await db.collection("properties").findOne({ _id: new ObjectId(id) });

    res.json(buildResponse(true, { views: property.views }, "Views incremented"));
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json(buildResponse(false, null, "Failed to increment views", error.message));
  }
});

export default router;
