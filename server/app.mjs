
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectToDatabase } from "./db/conn.mjs";
import authRouter from "./routes/authRouter.mjs";
import userRouter from "./routes/userRouter.mjs";
import postAdRouter from "./routes/postAdRouter.mjs";
import propertyRouter from "./routes/propertyRouter.mjs";
import requireAuth from "./middlewares/requireAuth.mjs";
import cashfree from "./routes/PaymentController.mjs";
import membershipRouter from "./routes/membershipRouter.mjs";
import AdminRouter from "./routes/AdminRouter.mjs";
import couponRouter from "./routes/couponRouter.mjs";
import ContactUsRouter from "./routes/ContactUsRouter.mjs";
import cookieParser from "cookie-parser";
import path from "path";
import recommendationRouter from "./routes/recommendationRoutes.mjs";
import { fileURLToPath } from "url";
import { generateSitemapXML, generateSitemapGzipped } from './utils/sitemapGenerator.mjs';
import blogRouter from "./routes/blogRouter.mjs";

// Support __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configs
const port = process.env.PORT || 3001;
const clientURL = process.env.CLIENT_URL || "https://thehomedaze.com";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// === MIDDLEWARES ===
// Increase upload limits to avoid 413 error
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({ origin: clientURL, credentials: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method}\t${new Date().toLocaleString()}\t${req.url}`);
  next();
});

// sitemap route
app.get('/sitemap.xml', async (req, res) => {
  try {
    console.log('Sitemap route hit!');
    console.log('User-Agent:', req.headers['user-agent']);
    
    // Check if request is from a search engine crawler
    const userAgent = req.headers['user-agent'] || '';
    const isSearchEngineCrawler = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit/i.test(userAgent);
    
    if (isSearchEngineCrawler) {
      // Serve gzipped version to search engines
      const sitemap = await generateSitemapGzipped();
      res.header('Content-Type', 'application/xml');
      res.header('Content-Encoding', 'gzip');
      res.send(sitemap);
    } else {
      // Serve uncompressed version to browsers
      const sitemap = await generateSitemapXML();
      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    }
  } catch (e) {
    console.error('Sitemap error:', e);
    res.status(500).json({ error: 'Failed to generate sitemap', details: e.message });
  }
});


// Static files
// app.use(express.static("public"));
// app.get("/sitemap.xml", (req, res) => {
//   res.sendFile("sitemap.xml", { root: "./public" });
// });

// Dynamic sitemap route in your Express app
// app.get('/sitemap.xml', (req, res) => {
//   const allRoutes = ['/terms-and-conditions', '/all-properties', '/new-post', '/contact-us' , '/subscriptions', '/cancellation-policy']; // Add all your routes
//   const sitemap = generateSitemap(allRoutes);
//   res.header('Content-Type', 'application/xml');
//   res.send(sitemap);
// });

// function generateSitemap(urls) {
//   return `<?xml version="1.0" encoding="UTF-8"?>
//   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     ${urls.map(url => `
//       <url>
//         <loc>https://thehomedaze.com${url}</loc>
//       </url>
//     `).join('')}
//   </urlset>`;
// }

// API routes
app.use("/api/auth", authRouter);
app.use("/api/contact", ContactUsRouter);
app.use("/api/post/recommendations", requireAuth, recommendationRouter);
app.use("/api/admin", requireAuth, AdminRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/user", requireAuth, userRouter);
app.use("/api/post", postAdRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/payment", requireAuth, cashfree);
app.use("/api/blog", blogRouter);
app.use("/api/membership", (req, res, next) => {
  if (req.method === "GET" && req.path === "/") return membershipRouter(req, res, next);
  return requireAuth(req, res, () => membershipRouter(req, res, next));
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// MongoDB and server startup
connectToDatabase()
  .then(() => {
    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
