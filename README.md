# 🚚 Service Request Management System

A complete, production-ready full-stack application for managing service requests with real-time analytics, assignment scheduling, and comprehensive admin dashboard.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

## 📋 Table of Contents

- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🌐 Live Demo

> 🚀 **Coming Soon!** This application will be deployed to Render.com

**Once deployed, the demo will be available at:**
- 🌍 **Frontend**: `https://service-request-frontend.onrender.com` (Update after deployment)
- 🔌 **Backend API**: `https://service-request-backend.onrender.com/api` (Update after deployment)

**Demo Credentials:**
```
Username: admin
Password: admin123
```

> ⚠️ **Note**: Free tier services may take 30-60 seconds to wake up after inactivity.

📖 **Deployment Guide**: See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for step-by-step instructions.

---

## ✨ Features

### Customer Portal
- ✅ Submit service requests with validation
- ✅ Multiple service types (Package Delivery, Furniture Moving, etc.)
- ✅ Real-time form validation
- ✅ Success notifications

### Admin Dashboard
- ✅ Secure JWT authentication
- ✅ Real-time analytics & statistics
- ✅ 7-day service requests chart
- ✅ Service request management (CRUD)
- ✅ Advanced filtering and search
- ✅ Pagination support
- ✅ Assignment scheduling
- ✅ Status tracking workflow
- ✅ Driver and vehicle management

### Technical Features
- ✅ RESTful API with MVC architecture
- ✅ MySQL database with proper indexing
- ✅ JWT authentication & authorization
- ✅ Request/Response logging
- ✅ Error handling middleware
- ✅ Unit and API tests
- ✅ Docker containerization
- ✅ Responsive design
- ✅ Production-ready configuration

## 🛠 Tech Stack

### Backend
- **Node.js** (v18+) - Runtime environment
- **Express.js** (v4.18) - Web framework
- **MySQL** (v8.0) - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Winston** - Logging
- **Jest & Supertest** - Testing

### Frontend
- **React** (v18.2) - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **CSS3** - Styling (responsive)

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **ESLint & Prettier** - Code quality
- **Nodemon** - Development

## 🏗 Architecture

```
┌─────────────────┐
│   React SPA     │
│  (Frontend)     │
└────────┬────────┘
         │
    HTTP/REST
         │
┌────────▼────────┐
│   Express API   │
│   (Backend)     │
│  - Controllers  │
│  - Middleware   │
│  - Routes       │
└────────┬────────┘
         │
      MySQL
         │
┌────────▼────────┐
│  MySQL Database │
│  - Users        │
│  - Requests     │
│  - Assignments  │
│  - Drivers      │
│  - Vehicles     │
└─────────────────┘
```

### MVC Pattern
```
Model (Database) ──> Controller (Business Logic) ──> View (React Components)
                              │
                         Middleware
                     (Auth, Logging, Error)
```

## 📦 Prerequisites

### Required
- **Node.js** v18 or higher
- **npm** v9 or higher
- **MySQL** v8.0 or higher
- **Git**

### Optional (for Docker deployment)
- **Docker** v20+
- **Docker Compose** v2+

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd internTask

# Start all services
docker-compose up -d

# Wait 30 seconds for database initialization
# Access the application:
# - Customer Portal: http://localhost:3000
# - Admin Dashboard: http://localhost:3000/admin/login
# - Backend API: http://localhost:5000/api
```

### Option 2: Local Development

```bash
# Clone and install
git clone <repository-url>
cd internTask
npm run install:all

# Set up environment variables
cp .env.example .env
cd backend && cp .env backend/.env
cd ../frontend && cp .env frontend/.env

# Start MySQL (ensure it's running)
# Update backend/.env with your MySQL credentials

# Run migrations and seed data
cd backend
npm run migrate
npm run seed

# Start development servers (from root)
npm run dev

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
```

## 📥 Installation

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd internTask
```

### Step 2: Install Dependencies
```bash
# Install all dependencies
npm run install:all

# Or install individually
npm install              # Root
cd backend && npm install
cd ../frontend && npm install
```

### Step 3: Environment Configuration

Create `.env` files:

**backend/.env**
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=service_requests_db

JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:3000
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Database Setup

```bash
# Ensure MySQL is running
# Login to MySQL and create database (optional - migration does this)
mysql -u root -p
CREATE DATABASE service_requests_db;
EXIT;

# Run migrations
cd backend
npm run migrate

# Seed sample data
npm run seed
```

## 🏃 Running the Application

### Development Mode

```bash
# Option 1: Run both frontend and backend
npm run dev

# Option 2: Run separately
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

### Using Makefile

```bash
# View all commands
make help

# Install dependencies
make install

# Run development
make dev

# Run migrations
make migrate

# Seed database
make seed

# Run tests
make test

# Docker commands
make docker-up
make docker-down
```

## 🧪 Testing

### Run All Tests
```bash
cd backend
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Specific Tests
```bash
# Unit tests only
npm test -- unit.test.js

# API tests only
npm test -- api.test.js
```

### Test Results
- Unit tests cover utility functions (password hashing, JWT)
- API tests cover authentication and service request endpoints
- Coverage reports generated in `backend/coverage/`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com"
}
```

### Service Requests

#### Create Request (Public)
```http
POST /api/service-requests
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "555-1234",
  "service_type": "Package Delivery",
  "pickup_address": "123 Main St",
  "delivery_address": "456 Oak Ave",
  "preferred_date": "2024-12-01",
  "special_instructions": "Handle with care"
}
```

#### Get All Requests (Protected)
```http
GET /api/service-requests?page=1&limit=10&status=pending&search=john
Authorization: Bearer <token>
```

#### Get Request by ID (Protected)
```http
GET /api/service-requests/:id
Authorization: Bearer <token>
```

#### Update Request (Protected)
```http
PUT /api/service-requests/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Update Status (Protected)
```http
PATCH /api/service-requests/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Assignments

#### Create Assignment (Protected)
```http
POST /api/assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "request_id": 1,
  "driver_id": 1,
  "vehicle_id": 1,
  "scheduled_date": "2024-12-01T10:00:00"
}
```

#### Get All Assignments (Protected)
```http
GET /api/assignments?page=1&limit=10
Authorization: Bearer <token>
```

### Analytics

#### Get Dashboard Stats (Protected)
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>

Response:
{
  "totalRequests": 25,
  "pendingRequests": 5,
  "completedRequests": 15,
  "activeAssignments": 3,
  "availableDrivers": 4,
  "availableVehicles": 3
}
```

#### Get Requests by Day (Protected)
```http
GET /api/analytics/requests-by-day?days=7
Authorization: Bearer <token>

Response:
[
  { "date": "2024-11-20", "count": 3 },
  { "date": "2024-11-21", "count": 5 },
  ...
]
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `404` - Not Found
- `500` - Internal Server Error

## 🚢 Deployment

### Render.com Deployment (Recommended)

**✨ Complete deployment guide available in [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

Quick overview:
1. Set up free MySQL database (Aiven)
2. Deploy backend to Render
3. Deploy frontend to Render
4. Update README with live demo links

**Total Cost:** $0/month (Free tier)
**Deployment Time:** 30-45 minutes

---

### Docker Deployment

1. **Build and Start**
```bash
docker-compose up -d --build
```

2. **Environment Variables**
Update `docker-compose.yml` with production values

3. **Access Application**
- Application: http://your-domain.com
- API: http://your-domain.com/api

### Manual Deployment

#### Backend (Node.js)
```bash
cd backend
npm ci --production
npm run migrate
npm run seed
NODE_ENV=production npm start
```

#### Frontend (React)
```bash
cd frontend
npm ci
npm run build
# Serve the 'build' folder with Nginx/Apache
```

### Environment Variables (Production)
```env
NODE_ENV=production
DB_HOST=your-db-host
JWT_SECRET=change-this-to-random-secure-string
CORS_ORIGIN=https://your-domain.com
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔧 Troubleshooting

### Database Connection Issues

**Problem:** Can't connect to MySQL

**Solution:**
```bash
# Check MySQL is running
systemctl status mysql   # Linux
brew services list       # macOS

# Test connection
mysql -u admin -p

# Verify credentials in backend/.env
```

### Port Already in Use

**Problem:** Port 3000 or 5000 already in use

**Solution:**
```bash
# Find and kill process (Linux/macOS)
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker Issues

**Problem:** Containers won't start

**Solution:**
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Migration Errors

**Problem:** Migration fails

**Solution:**
```bash
# Drop database and retry
mysql -u admin -p
DROP DATABASE service_requests_db;
EXIT;

# Re-run migration
cd backend
npm run migrate
npm run seed
```

### Frontend Build Errors

**Problem:** npm run build fails

**Solution:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Database Schema

### Tables

**users**
- id (PK)
- username (unique)
- password_hash
- email (unique)
- role (admin/user)
- created_at, updated_at

**service_requests**
- id (PK)
- customer_name
- customer_email
- customer_phone
- service_type
- pickup_address
- delivery_address
- preferred_date
- special_instructions
- status (pending/assigned/in_progress/completed/cancelled)
- created_at, updated_at

**drivers**
- id (PK)
- name
- phone
- email
- license_number (unique)
- status (available/assigned/off_duty)
- created_at, updated_at

**vehicles**
- id (PK)
- model
- plate_number (unique)
- year
- capacity
- status (available/in_use/maintenance)
- created_at, updated_at

**assignments**
- id (PK)
- request_id (FK)
- driver_id (FK)
- vehicle_id (FK)
- scheduled_date
- status (scheduled/in_progress/completed/cancelled)
- created_at, updated_at

## 🔐 Default Credentials

```
Username: admin
Password: admin123
```

⚠️ **Change these credentials in production!**

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Developed as a demonstration of full-stack development skills.

## 🙏 Acknowledgments

- Express.js community
- React community
- MySQL team
- Docker team

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or create an issue.

**Happy Coding! 🚀**
