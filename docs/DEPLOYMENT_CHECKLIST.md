# 🚀 Quick Deployment Checklist

Use this checklist while deploying to Render.com.

## ✅ Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] Database migrations working
- [ ] Render account created

## 📦 Step 1: Database Setup (5 min)

- [ ] Sign up for Aiven.io
- [ ] Create MySQL free tier service
- [ ] Wait for service to start (3-5 min)
- [ ] Copy connection credentials:
  - Host: `__________________`
  - Port: `__________________`
  - User: `__________________`
  - Password: `__________________`
  - Database: `__________________`

## 🔧 Step 2: Backend Deployment (10 min)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `service-request-backend`
  - Root Directory: `backend`
  - Build Command: `npm install && npm run migrate`
  - Start Command: `npm start`
- [ ] Add environment variables (10 variables)
- [ ] Deploy and wait for completion
- [ ] Copy backend URL: `__________________`
- [ ] Test health endpoint: `/api/health`

## 🎨 Step 3: Frontend Deployment (10 min)

- [ ] Create new Static Site on Render
- [ ] Connect GitHub repository
- [ ] Configure service:
  - Name: `service-request-frontend`
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
- [ ] Add environment variable:
  - `REACT_APP_API_URL`: `<backend-url>/api`
- [ ] Deploy and wait for completion
- [ ] Copy frontend URL: `__________________`

## 🔄 Step 4: Final Configuration (5 min)

- [ ] Update backend CORS_ORIGIN with frontend URL
- [ ] Redeploy backend service
- [ ] Initialize database:
  - Connect to backend shell
  - Run: `npm run init-db`

## ✨ Step 5: Testing (5 min)

- [ ] Visit frontend URL
- [ ] Login with admin credentials
- [ ] Create test service request
- [ ] Check dashboard loads
- [ ] Verify all features work

## 📝 Step 6: Documentation (5 min)

- [ ] Update README.md with:
  - Frontend demo link
  - Backend API link
- [ ] Commit and push changes
- [ ] Update GitHub repository description
- [ ] Add deployment status badge (optional)

## 🎉 Done!

**Your Live URLs:**
- Frontend: `__________________`
- Backend: `__________________`

**Share your project:**
```
🚀 Check out my Service Request Management System!
Demo: [Your frontend URL]
GitHub: https://github.com/MOHAMED-MUHNI/service-request-management-system
```

---

## 🆘 Troubleshooting

**Issue**: Backend won't start
- Check database credentials
- Verify PORT is set to 10000
- Check logs in Render dashboard

**Issue**: Frontend shows API error
- Verify REACT_APP_API_URL is correct
- Check CORS configuration
- Ensure backend is running

**Issue**: Database connection fails
- Verify Aiven service is running
- Check all credentials match
- Ensure SSL is enabled

---

**Need detailed help?** See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
