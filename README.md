# HomeDaze - Real Estate Platform

A production-ready full-stack real estate platform built with React, TypeScript, Node.js, and MongoDB.

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for styling
- **React Router DOM** for client-side routing
- **Progressive Web App (PWA)** support
- **Error boundaries** and loading states

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Redis** for caching and rate limiting
- **JWT** authentication
- **Socket.io** for real-time features
- **Comprehensive validation** and security middleware

## 🚀 Features

### 🏠 Property Management
- Property listings with advanced search and filters
- Image upload with multiple cloud storage options (AWS S3, Cloudinary)
- Property verification system
- Geolocation and maps integration

### 👥 User Management
- Secure authentication with JWT
- User profiles and verification
- Role-based access control
- Google OAuth integration

### 💳 Membership & Payments
- Multiple membership tiers
- Cashfree payment gateway integration
- Subscription management
- Coupon and discount system

### 🛡️ Security Features
- Rate limiting with Redis
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- SQL injection and XSS prevention

### 📱 Additional Features
- Admin dashboard with analytics
- Blog system
- Testimonials
- Contact forms with email integration
- SEO optimization
- Responsive design
- PWA capabilities

## 🛠️ Tech Stack

| Frontend | Backend | Database | DevOps |
|----------|---------|----------|--------|
| React 18 | Node.js | MongoDB | Docker |
| TypeScript | Express.js | Redis | Docker Compose |
| Vite | Socket.io | | Nginx |
| Tailwind CSS | JWT | | |
| PWA | Cloudinary/S3 | | |

## 📋 Prerequisites

- Node.js (>= 18.0.0)
- npm (>= 8.0.0)
- MongoDB (>= 6.0)
- Redis (>= 7.0)
- Docker & Docker Compose (optional)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/homedaze.git
cd homedaze
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment files
cp server/.env.example server/.env

# Edit the environment variables
nano server/.env
```

### 4. Database Setup
```bash
# Start MongoDB and Redis (if running locally)
mongod
redis-server

# Or use Docker Compose
docker-compose up -d mongodb redis
```

### 5. Start Development Servers
```bash
# Start backend server
cd server
npm run dev

# In another terminal, start frontend
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🐳 Docker Deployment

### Development with Docker
```bash
# Start only database services
docker-compose up -d mongodb redis

# Run application locally
npm run dev
cd server && npm run dev
```

## 🧪 Testing

### Frontend Tests
```bash
npm run test
npm run test:coverage
npm run test:ui
```

### Backend Tests
```bash
cd server
npm run test
npm run test:coverage
```

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Lint code

### Backend
- `npm run start` - Start production server
- `npm run dev` - Start development server
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run security-audit` - Security audit

## 📁 Project Structure

```
homedaze/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── types/             # TypeScript type definitions
│   ├── api/               # API client functions
│   └── test/              # Test utilities
├── server/                # Backend source code
│   ├── routes/            # Express routes
│   ├── models/            # MongoDB models
│   ├── middlewares/       # Custom middleware
│   ├── utils/             # Utility functions
│   └── db/                # Database configuration
├── public/                # Static assets
├── dist/                  # Built frontend (generated)
├── docker-compose.yml     # Docker services configuration
└── README.md             # This file
```

## 🔐 Environment Variables

Key environment variables (see `server/.env.example` for complete list):

```env
# Database
ATLAS_URI=mongodb://localhost:27017/homedaze
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=your-secret-key
BCRYPT_ROUNDS=12

# External Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CASHFREE_APP_ID=your-cashfree-id
GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚀 Deployment

### Production Checklist
- [ ] Set up SSL certificates
- [ ] Configure environment variables
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline
- [ ] Performance testing
- [ ] Security audit

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: AWS EC2, DigitalOcean, or Railway
- **Database**: MongoDB Atlas or self-hosted
- **Redis**: Redis Cloud or AWS ElastiCache

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@thehomedaze.com or create an issue on GitHub.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- All contributors and open-source packages used

---

**Made with ❤️ by the HomeDaze Team**

## ⚙️ CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration (CI):
- Installs dependencies
- Runs lint and tests
- Builds frontend and backend

The workflow is defined in `.github/workflows/ci.yml` and runs on every push and pull request to `main`/`master`.

### Example Workflow Steps
- Checkout code
- Use Node.js 18
- Install dependencies
- Lint and test
- Build for production

You can customize the workflow for deployment to your preferred cloud provider.

## 🐳 Production Deployment (Docker Compose)

1. **Set environment variables** in `server/.env` (see `.env.example`).
2. **Build and start all services:**
   ```bash
   docker-compose up -d --build
   ```
3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```
4. **Access the app:**
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost:3001

### Production Checklist
- [x] Set up SSL certificates (use a reverse proxy like Nginx or Caddy)
- [x] Configure environment variables
- [x] Set up monitoring (Sentry, etc.)
- [x] Configure backup strategies
- [x] Set up CI/CD pipeline (see above)
- [x] Performance testing
- [x] Security audit

---