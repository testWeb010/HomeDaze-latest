import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import Token from "../models/passwordResetToken.mjs";
import { getDb } from "../db/conn.mjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.mjs";
import VToken from "../models/verificationToken.mjs";
import { OAuth2Client } from "google-auth-library";
import { validateUserRegistration } from "../middlewares/validation.mjs";
import { authLimiter } from "../middlewares/rateLimiter.mjs";
import requireAuth from "../middlewares/requireAuth.mjs";

const router = express.Router();

// Helper function to build standard response
const buildResponse = (success, data = null, message = '', error = null) => ({
  success,
  data,
  message,
  error
});

// Helper function to generate JWT token
const generateTokens = (user) => {
  const token = jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      email: user.email,
      membershipTier: user.membershipTier 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  return { token, refreshToken };
};

// Helper function to format user for response
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || '',
  avatar: user.photo || user.avatar || '',
  verified: user.isVerified || false,
  membershipTier: user.membershipTier || 'free',
  membershipExpiry: user.membershipExpiry,
  chatCredits: user.chatCredits || 0,
  joinedDate: user.createdAt || user.joinedDate
});

// Register API
router.post("/register", authLimiter, validateUserRegistration, async (req, res) => {
  // check valid email
  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({ message: "Invalid email" });
  }
  // check valid password
  if (!isValidPassword(req.body.password)) {
    return res.status(400).json({ message: "Invalid password" });
  }
  // check valid username
  if (!isValidUsername(req.body.username)) {
    return res.status(400).json({ message: "Invalid username" });
  }
  // check valid name
  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }
  const db = getDb().connection;

  //   check if user exists
  const user = await db.collection("users").findOne({
    $or: [
      { email: req.body.email, accountType: "local" },
      { username: req.body.username, accountType: "local" },
    ],
  });
  if (user) {
    // check if verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }
    // send verification mail
    let token = db
      .collection("emailverificationtokens")
      .findOne({ user: user._id });
    if (token) {
      await db
        .collection("emailverificationtokens")
        .deleteOne({ user: user._id });
    }
    // create new token
    let verificationToken = new VToken({
      user: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    verificationToken = await verificationToken.save();

    // create veriication link
    let url = `${process.env.CLIENT_URL}/verify-email/${verificationToken.token}`;

    // send Email
    await sendEmail(
      user.email,
      "Email Verification",
      "Click this link to verify your email\n" + url
    );

    return res
      .status(200)
      .json({ message: "Verification mail sent. Please verify." });
  }
  // hash password
  const numSaltRounds = process.env.NODE_ENV === "development" ? 1 : 10;
  const password = await bcrypt.hash(req.body.password, numSaltRounds);
  // create new user
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    name: req.body.name,
    password: password,
  });

  const savedUser = await newUser.save();

  let token = db
    .collection("emailverificationtokens")
    .findOne({ user: savedUser._id });
  if (token) {
    await db
      .collection("emailverificationtokens")
      .deleteOne({ user: savedUser._id });
  }

  // create new token
  let verificationToken = new VToken({
    user: savedUser._id,
    token: crypto.randomBytes(16).toString("hex"),
  });

  verificationToken = await verificationToken.save();

  // create veriication link
  let url = `${process.env.CLIENT_URL}/verify-email/${verificationToken.token}`;

  // send Email
  await sendEmail(
    savedUser.email,
    "Email Verification",
    "Click this link to verify your email\n" + url
  );

  return res
    .status(201)
    .json(buildResponse(true, null, "Registration successful. Please check your email for verification."));
});

// login API
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json(buildResponse(false, null, "Email and password are required"));
    }

    const db = getDb().connection;

    // Find user by email
    const user = await db.collection("users").findOne({ 
      email: email.toLowerCase(),
      accountType: "local" 
    });

    if (!user) {
      return res.status(401).json(buildResponse(false, null, "Invalid email or password"));
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json(buildResponse(false, null, "Invalid email or password"));
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(401).json(buildResponse(false, null, "Please verify your email before logging in"));
    }

    // Generate tokens
    const { token, refreshToken } = generateTokens(user);
    
    // Set token in a cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Format user response
    const userResponse = formatUserResponse(user);

    return res.json(buildResponse(true, { 
      user: userResponse, 
      token, 
      refreshToken 
    }, "Login successful"));
    
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json(buildResponse(false, null, "Internal server error", err.message));
  }
});

// Logout API
router.post("/logout", requireAuth, async (req, res) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return a success response
    return res.json(buildResponse(true, null, "Logout successful"));
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json(buildResponse(false, null, "Internal server error", err.message));
  }
});

// Refresh token API
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json(buildResponse(false, null, "Refresh token is required"));
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    const db = getDb().connection;
    const user = await db.collection("users").findOne({ _id: decoded.id });
    
    if (!user) {
      return res.status(401).json(buildResponse(false, null, "Invalid refresh token"));
    }

    // Generate new access token
    const { token } = generateTokens(user);
    
    return res.json(buildResponse(true, { token }, "Token refreshed successfully"));
    
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(401).json(buildResponse(false, null, "Invalid refresh token", err.message));
  }
});

// verify email
router.post("/verify-email", async (req, res) => {
  const { token, userId } = req.body;
  try {
    // find token
    const db = getDb().connection;
    let vtoken = await db
      .collection("emailverificationtokens")
      .findOne({ token: token });
    if (!vtoken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // find user
    let user = await db.collection("users").findOne({ _id: vtoken.user });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // update user verification status
    await db
      .collection("users")
      .findOneAndUpdate({ _id: vtoken.user }, { $set: { isVerified: true } });

    // delete token
    await db
      .collection("emailverificationtokens")
      .deleteOne({ _id: vtoken._id });

    return res.json(buildResponse(true, null, "Email verified successfully"));
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json(buildResponse(false, null, "Internal server error", err.message));
  }
});

// Resend verification email
router.post("/resend-verification", authLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json(buildResponse(false, null, "Email is required"));
    }

    const db = getDb().connection;
    const user = await db.collection("users").findOne({ 
      email: email.toLowerCase(),
      accountType: "local" 
    });

    if (!user) {
      return res.status(404).json(buildResponse(false, null, "User not found"));
    }

    if (user.isVerified) {
      return res.status(400).json(buildResponse(false, null, "Email is already verified"));
    }

    // Remove existing token
    await db.collection("emailverificationtokens").deleteOne({ user: user._id });

    // Create new verification token
    const verificationToken = new VToken({
      user: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await verificationToken.save();

    // Create verification link
    const url = `${process.env.CLIENT_URL}/verify-email/${verificationToken.token}`;

    // Send email
    await sendEmail(
      user.email,
      "Email Verification",
      `Click this link to verify your email: ${url}`
    );

    return res.json(buildResponse(true, null, "Verification email sent successfully"));
    
  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json(buildResponse(false, null, "Internal server error", err.message));
  }
});

// reset password API to send password reset email
router.post("/forgot-password", async (req, res) => {
  const emailOrUsernameInput = req.body.emailOrUsername; 
  const validationType = checkEmailOrUsername(emailOrUsernameInput);


  if (validationType === "invalid") {
    return res.status(400).json({ message: "Invalid email or username format." });
  }

  let user = null;
  const db = getDb().connection;


  if (validationType === "email") {
    user = await db.collection("users").findOne({ email: emailOrUsernameInput, accountType: "local" });
  } else if (validationType === "username") {
    user = await db.collection("users").findOne({ username: emailOrUsernameInput, accountType: "local" });
  }

  if (!user) {
    const message = `You do not have an account with this ${validationType}. Please create an account.`;
    return res.status(400).json({ message });
  }

  let token = await db.collection("passwordresettokens").findOne({ user: user._id });
  if (token) {
    await db.collection("passwordresettokens").deleteOne({ user: user._id });
  }

  let resetToken = new Token({
    user: user._id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  await resetToken.save();

  let url = `${process.env.CLIENT_URL}/reset-password/${resetToken.token}`;

  // Send email
  await sendEmail(
    user.email,
    "Password Reset",
    `Click this link to reset your password: ${url}`
  );

  return res.json({
    status: "OK",
    message: "Password reset email sent",
  });
});



// reset password API to reset password
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  try {
    // find token
    const db = getDb().connection;
    let resetToken = await db
      .collection("passwordresettokens")
      .findOne({ token: token });
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    // find user
    const user = await db
      .collection("users")
      .findOne({ _id: resetToken.user, accountType: "local" });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // check password should not be same as the old password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      return res.status(400).json({ message: "Password cannot be same" });
    }

    // hash password
    const numSaltRounds = process.env.NODE_ENV === "development" ? 1 : 10;
    const hassedPassword = await bcrypt.hash(password, numSaltRounds);

    // update password
    await db
      .collection("users")
      .findOneAndUpdate(
        { _id: resetToken.user },
        { $set: { password: hassedPassword } }
      );

    // delete token
    await db
      .collection("passwordresettokens")
      .deleteOne({ _id: resetToken._id });

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// google auth API

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

const getUserData = async (access_token) => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${access_token}`
  );
  return await res.json();
};

router.get("/google-request", async (req, res) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const authorizeURI = client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      prompt: "consent",
    });

    return res.json(buildResponse(true, { url: authorizeURI }));
  } catch (err) {
    console.error("Google auth request error:", err);
    return res.status(500).json(buildResponse(false, null, "Failed to generate Google auth URL", err.message));
  }
});

// Google auth callback (for URL redirect)
router.get("/google", async (req, res) => {
  const access_code = req.query.code;
  try {
    const response = await oAuth2Client.getToken(access_code);
    await oAuth2Client.setCredentials(response.tokens);
    const googleUser = oAuth2Client.credentials;
    const userData = await getUserData(googleUser.access_token);

    const db = getDb().connection;
    let user = await db.collection("users").findOne({ 
      email: userData.email, 
      accountType: "google" 
    });

    let tokens = null;
    if (user) {
      tokens = generateTokens(user);
    } else {
      // Create new user
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        photo: userData.picture,
        username: userData.email.split("@")[0].substr(0, 8) + Math.floor(Math.random() * 1000),
        accountType: "google",
        isVerified: true,
        membershipTier: "free",
        chatCredits: 5
      });

      user = await newUser.save();
      tokens = generateTokens(user);
    }
    
    return res.redirect(
      `${process.env.CLIENT_URL}/google-auth-success?token=${tokens.token}&refreshToken=${tokens.refreshToken}`
    );
  } catch (err) {
    console.error("Google auth error:", err);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
  }
});

// Google auth for API (for frontend service)
router.post("/google", async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json(buildResponse(false, null, "Authorization code is required"));
    }

    const response = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(response.tokens);
    const googleUser = oAuth2Client.credentials;
    const userData = await getUserData(googleUser.access_token);

    const db = getDb().connection;
    let user = await db.collection("users").findOne({ 
      email: userData.email, 
      accountType: "google" 
    });

    if (user) {
      // Existing user
      const { token, refreshToken } = generateTokens(user);
      const userResponse = formatUserResponse(user);
      
      return res.json(buildResponse(true, { 
        user: userResponse, 
        token, 
        refreshToken 
      }, "Login successful"));
    } else {
      // Create new user
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        photo: userData.picture,
        username: userData.email.split("@")[0].substr(0, 8) + Math.floor(Math.random() * 1000),
        accountType: "google",
        isVerified: true,
        membershipTier: "free",
        chatCredits: 5
      });

      user = await newUser.save();
      const { token, refreshToken } = generateTokens(user);
      const userResponse = formatUserResponse(user);
      
      return res.json(buildResponse(true, { 
        user: userResponse, 
        token, 
        refreshToken 
      }, "Registration successful"));
    }
  } catch (err) {
    console.error("Google auth API error:", err);
    return res.status(500).json(buildResponse(false, null, "Google authentication failed", err.message));
  }
});

// functions
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const usernameRegex = /^[a-z0-9_.]{2,}$/;

function isValidEmail(email) {
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return passwordRegex.test(password);
}

function isValidUsername(username) {
  return usernameRegex.test(username);
}

function checkEmailOrUsername(str) {
  if (isValidEmail(str)) {
    return "email";
  } else if (isValidUsername(str)) {
    return "username";
  } else {
    return "invalid";
  }
}

export default router;
