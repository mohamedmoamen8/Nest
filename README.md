# NestSat 🚀

A robust, production-ready NestJS backend API with built-in authentication, database integration, email services, and comprehensive middleware/interceptor support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Development](#development)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

## 🎯 Overview

**NestSat** is a comprehensive NestJS backend application designed to serve as a solid foundation for enterprise-level API development. It includes production-ready features like JWT authentication, role-based authorization, MongoDB integration, email notifications, and Redis caching.

## ✨ Features

- **🔐 JWT Authentication** - Secure authentication using Passport.js and JWT tokens
- **👥 User Management** - Complete user CRUD operations with bcrypt password hashing
- **📧 Email Service** - Nodemailer integration for sending emails
- **🗄️ MongoDB Integration** - Mongoose ORM for database operations
- **💾 Redis Caching** - IORedis for session and data caching
- **🛡️ Authorization Guards** - Role-based access control
- **✅ Input Validation** - class-validator and class-transformer for request validation
- **📝 Logging Middleware** - Request/response logging for all routes
- **🎯 Global Response Interceptor** - Unified API response format
- **⚡ Health Check** - Service health monitoring endpoints
- **🧪 Comprehensive Testing** - Jest setup for unit and e2e tests
- **🔍 Error Handling** - Centralized exception handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.7.x
- **Database**: MongoDB + Mongoose
- **Cache**: Redis (IORedis)
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator, class-transformer
- **Email**: Nodemailer
- **Testing**: Jest, Supertest
- **Code Quality**: ESLint, Prettier
- **Configuration**: @nestjs/config (dotenv)

## 📁 Project Structure

```
src/
├── auth/                    # Authentication module (login, signup, JWT)
├── users/                   # User management module
├── health/                  # Health check endpoints
├── common/
│   ├── guards/             # Auth & Authorization guards
│   ├── interceptors/       # Response interceptor
│   ├── middleware/         # Logger middleware
│   ├── modules/            # Shared modules (tokens, email)
│   └── email/              # Email service
├── schems/                 # Database schemas (Mongoose)
├── repo/                   # Data repositories
├── DB/                     # Database configuration
├── app.module.ts           # Root module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── main.ts                 # Application bootstrap
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance running
- Redis instance running (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mohamedmoamen8/Nest.git
cd Nest
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the example env file
cp config/dev.env.example config/dev.env

# Edit config/dev.env with your settings
nano config/dev.env
```

### Quick Start

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod

# Build the project
npm run build
```

The API will be available at: `http://localhost:3000/api/v1`

## ⚙️ Configuration

Create a `config/dev.env` file in your project root:

```env
# Server
PORT=3000
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/nestsat

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRATION=24h

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@nestsat.com

# Node Environment
NODE_ENV=development
```

## 📡 API Endpoints

### Health Check
```
GET /api/v1/health
```

### Authentication
```
POST /api/v1/auth/signup      # Register new user
POST /api/v1/auth/login       # Login user
POST /api/v1/auth/refresh     # Refresh JWT token
```

### Users
```
GET    /api/v1/users          # Get all users (protected)
GET    /api/v1/users/:id      # Get user by ID (protected)
PUT    /api/v1/users/:id      # Update user (protected)
DELETE /api/v1/users/:id      # Delete user (protected)
```

### App Info
```
GET /api/v1                    # Get app info
GET /api/v1/port               # Get running port
```

## 🧑‍💻 Development

### Code Formatting & Linting

```bash
# Format code with Prettier
npm run format

# Lint code with ESLint
npm run lint
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:cov

# Run e2e tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## 🏗️ Build & Deployment

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run start:prod
```

### Docker Support (Optional)
You can create a Dockerfile for containerized deployment:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 📝 Security Recommendations

- ✅ Change JWT_SECRET in production
- ✅ Use HTTPS/TLS in production
- ✅ Implement rate limiting
- ✅ Validate and sanitize all inputs (already configured)
- ✅ Use strong passwords and hash them with bcrypt (configured)
- ✅ Keep dependencies updated regularly
- ✅ Use environment variables for sensitive data

## 📄 License

UNLICENSED - Proprietary software

## 👤 Author

**Mohamed Moamen**
- GitHub: [@mohamedmoamen8](https://github.com/mohamedmoamen8)

## 🤝 Contributing

Feel free to fork, modify, and submit pull requests.

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Passport.js Authentication](http://www.passportjs.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/)

---

**Note**: This is a Satellite API template (`nest_sat`) designed to be deployed alongside other microservices in a distributed system architecture.
