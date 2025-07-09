import jwt from 'jsonwebtoken';
import { User } from '../models/user.mjs';

/**
 * Middleware to authenticate requests using a JWT token stored in a cookie
 * or in the Authorization header as a fallback.
 */
export const cookieAuth = async (req, res, next) => {
  try {
    let token;
    
    // First check for token in cookies
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    } else {
      // Fallback to Authorization header
      const bearer = req.headers["authorization"];
      if (!bearer) {
        return res.status(401).json({ message: "Unauthorized access - no token provided" });
      }
      const parts = bearer.split(" ");
      if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ message: "Unauthorized access - invalid token format" });
      }
      token = parts[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access - no token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized access - invalid token" });
    }

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized access - user not found" });
    }

    // Attach user information to the request for use in subsequent middleware/routes
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(401).json({ message: "Unauthorized access - authentication failed" });
  }
};

/**
 * Middleware to check if the authenticated user has the required role
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - insufficient permissions" });
    }
    next();
  };
};
