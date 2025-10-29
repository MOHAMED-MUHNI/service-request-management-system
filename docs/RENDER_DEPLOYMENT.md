# 🚀 Deploying to Render.com - Complete Guide

This guide will walk you through deploying your Service Request Management System to Render.com's free tier.

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be pushed to GitHub
   - Repository: `https://github.com/MOHAMED-MUHNI/service-request-management-system`
   - Make sure all code is committed and pushed

2. **Render Account**: Sign up at [render.com](https://render.com)
   - Use your GitHub account for easy integration

## 🗂️ Deployment Architecture

```
┌─────────────────────────────────────────────┐
│         Render.com Free Tier                │
├─────────────────────────────────────────────┤
│  Frontend (Static Site)                     │
│  └─ React Build → Nginx                     │
├─────────────────────────────────────────────┤
│  Backend (Web Service)                      │
│  └─ Node.js + Express API                   │
├─────────────────────────────────────────────┤
│  Database (MySQL - External)                │
│  └─ Free MySQL from Aiven/PlanetScale       │
└─────────────────────────────────────────────┘
```

## 🎯 Step-by-Step Deployment

### Step 1: Set Up Free MySQL Database

Since Render's free tier doesn't include MySQL, we'll use **Aiven** (offers free MySQL):

#### Option A: Aiven (Recommended)
1. Go to [aiven.io](https://aiven.io)
2. Sign up for free account
3. Click "Create Service" → Select "MySQL"
4. Choose:
   - Cloud: AWS
   - Region: US East (or closest to you)
   - Plan: **Free tier** (Hobbyist)
   - Service name: `service-request-mysql`
5. Click "Create Service" (takes 3-5 minutes)
6. Once running, go to "Overview" tab and copy:
   - **Host**: `service-request-mysql-yourname.aivencloud.com`
   - **Port**: `25060`
   - **User**: `avnadmin`
   - **Password**: (shown in the dashboard)
   - **Database**: `defaultdb`

#### Option B: PlanetScale (Alternative)
1. Go to [planetscale.com](https://planetscale.com)
2. Sign up and create database
3. Get connection credentials

**Save these credentials!** You'll need them for Render environment variables.

---

### Step 2: Deploy Backend to Render

1. **Login to Render Dashboard**
   - Go to [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select: `service-request-management-system`

3. **Configure Backend Service**
   ```
   Name: service-request-backend
   Region: Oregon (US West) - Free tier
   Branch: main
   Root Directory: backend
   Environment: Node
   Build Command: npm install && npm run migrate
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```env
   NODE_ENV=production
   PORT=10000
   
   # Database (from Step 1 - Aiven credentials)
   DB_HOST=service-request-mysql-yourname.aivencloud.com
   DB_PORT=25060
   DB_USER=avnadmin
   DB_PASSWORD=your_password_from_aiven
   DB_NAME=defaultdb
   
   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_production_change_this_to_random_string
   JWT_EXPIRES_IN=24h
   
   # CORS Origin (will update after frontend deployment)
   CORS_ORIGIN=*
   ```

5. **Create Service**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Once deployed, copy the backend URL: `https://service-request-backend.onrender.com`

6. **Test Backend**
   - Visit: `https://service-request-backend.onrender.com/api/health`
   - Should return: `{"status":"OK"}`

---

### Step 3: Deploy Frontend to Render

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Select same GitHub repository

2. **Configure Frontend Service**
   ```
   Name: service-request-frontend
   Region: Oregon (US West)
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: build
   Plan: Free
   ```

3. **Add Environment Variable**
   Click "Advanced" → "Add Environment Variable":
   
   ```env
   REACT_APP_API_URL=https://service-request-backend.onrender.com/api
   ```
   
   ⚠️ **Important**: Replace with your actual backend URL from Step 2!

4. **Create Static Site**
   - Click "Create Static Site"
   - Wait 5-10 minutes for build and deployment
   - Once deployed, copy frontend URL: `https://service-request-frontend.onrender.com`

---

### Step 4: Update CORS Configuration

1. **Update Backend Environment Variables**
   - Go to your backend service on Render
   - Settings → Environment
   - Update `CORS_ORIGIN`:
   ```env
   CORS_ORIGIN=https://service-request-frontend.onrender.com
   ```

2. **Redeploy Backend**
   - Click "Manual Deploy" → "Deploy latest commit"

---

### Step 5: Initialize Database

1. **Connect to Backend Shell**
   - Go to backend service → "Shell" tab
   - Run initialization:
   ```bash
   npm run init-db
   ```

2. **Verify Database**
   - Try logging into your frontend
   - Default credentials: `admin` / `admin123`

---

### Step 6: Update README with Demo Link

After successful deployment, update your README.md:

```markdown
## 🌐 Live Demo

**Frontend**: https://service-request-frontend.onrender.com
**Backend API**: https://service-request-backend.onrender.com/api

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

> ⚠️ Note: Free tier services may take 30-60 seconds to wake up after inactivity.
```

---

## 🔧 Configuration Files Created

### 1. `backend/.env.production` (Optional - for reference)
```env
NODE_ENV=production
DB_HOST=your_mysql_host.aivencloud.com
DB_PORT=25060
DB_USER=avnadmin
DB_PASSWORD=your_password
DB_NAME=defaultdb
JWT_SECRET=production_secret_key
JWT_EXPIRES_IN=24h
```

### 2. Update `backend/src/server.js` for CORS

Make sure CORS is configured properly:
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## ⚡ Quick Troubleshooting

### Issue: Backend returns 502 Bad Gateway
**Solution**: 
- Check logs in Render dashboard
- Verify database credentials
- Ensure `PORT` is set to `10000` (Render's default)

### Issue: Frontend can't connect to backend
**Solution**:
- Check `REACT_APP_API_URL` environment variable
- Ensure CORS is properly configured
- Check browser console for errors

### Issue: Database connection fails
**Solution**:
- Verify Aiven MySQL service is running
- Check credentials match exactly
- Ensure SSL connection is enabled (Aiven requires it)

### Issue: "Service unavailable" on first visit
**Solution**:
- Free tier services sleep after 15 min of inactivity
- Wait 30-60 seconds for service to wake up
- This is normal for free tier

---

## 💰 Cost Breakdown

| Service | Provider | Cost |
|---------|----------|------|
| MySQL Database | Aiven | $0/month (Free tier) |
| Backend API | Render | $0/month (Free tier) |
| Frontend | Render | $0/month (Free tier) |
| **Total** | | **$0/month** ✅ |

**Free Tier Limits:**
- 750 hours/month compute time
- Services sleep after 15 min inactivity
- 100 GB bandwidth/month
- Perfect for demo/portfolio projects!

---

## 🎯 Post-Deployment Checklist

- [ ] Backend health check returns OK
- [ ] Frontend loads successfully
- [ ] Can login with admin credentials
- [ ] Can create service request
- [ ] Can view dashboard
- [ ] Can track request status
- [ ] All API endpoints working
- [ ] Demo link added to README
- [ ] Repository updated with deployment info

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push to `main` branch
3. Render automatically builds and deploys
4. Check deployment status in dashboard

---

## 📱 Share Your Demo

Once deployed, share your project:

```
🚀 Check out my Service Request Management System!

Frontend: https://service-request-frontend.onrender.com
GitHub: https://github.com/MOHAMED-MUHNI/service-request-management-system

Built with: Node.js, Express, React, MySQL
Features: Role-based access, Real-time tracking, Modern UI
```

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Aiven Docs**: https://docs.aiven.io
- **Check Render status**: https://status.render.com

---

**Estimated Total Time**: 30-45 minutes ⏱️

Good luck with your deployment! 🚀
