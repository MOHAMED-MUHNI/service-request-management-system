# ⚡ Quick Start Guide

Get the Service Request App running in minutes!

## 🚀 Fastest Way (Docker - 2 minutes)

```bash
# 1. Start everything
docker-compose up -d

# 2. Wait 30 seconds for database initialization

# 3. Open your browser
```

**Access the app:**
- 🌐 Customer Portal: http://localhost:3000
- 👨‍💼 Admin Dashboard: http://localhost:3000/admin/login
- 🔌 Backend API: http://localhost:5000/api

**Default Login:**
- Username: `admin`
- Password: `admin123`

**That's it! You're done! 🎉**

---

## 🛠️ Alternative: Local Development (5 minutes)

### Prerequisites Check

```bash
# Check if you have Node.js installed
node --version  # Should be 18+

# Check if you have MySQL installed
mysql --version  # Should be 8.0+
```

### Installation Steps

```bash
# 1. Install all dependencies
npm run install:all

# 2. Configure environment
# Edit backend/.env with your MySQL credentials

# 3. Setup database
cd backend
npm run migrate
npm run seed

# 4. Start the app
cd ..
npm run dev
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## 📋 What You Get

### Customer Features ✨
- Submit service requests
- Choose service types
- Set preferred dates
- Add special instructions

### Admin Features 📊
- View dashboard statistics
- See 7-day trends
- Manage all requests
- Schedule assignments
- Track status updates

---

## 🎯 First Steps

### As a Customer:
1. Go to http://localhost:3000
2. Fill out the service request form
3. Submit and receive confirmation

### As an Admin:
1. Go to http://localhost:3000/admin/login
2. Login with: admin / admin123
3. View the dashboard
4. Click "Schedule" on pending requests
5. Assign driver and vehicle

---

## 🔍 Testing the API

### Using Postman:
1. Import `postman_collection.json`
2. Run the "Login" request
3. Token is saved automatically
4. Try other endpoints

### Using curl (Windows PowerShell):

**Login:**
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.token
```

**Get Service Requests:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/service-requests" -Headers $headers
```

---

## 🐛 Troubleshooting

### Docker not working?

```bash
# Check if Docker is running
docker ps

# Restart Docker Desktop

# Try again
docker-compose down
docker-compose up -d
```

### Port already in use?

```powershell
# Windows - Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or change ports in docker-compose.yml
```

### Database connection error?

```bash
# Check if MySQL is running
docker-compose ps mysql

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Can't login?

```bash
# Re-seed the database
docker-compose exec backend npm run seed

# Or check credentials in backend/logs/
```

---

## 📚 Next Steps

1. **Explore the Code**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Read Documentation**
   - [README.md](README.md) - Full documentation
   - [ARCHITECTURE.md](ARCHITECTURE.md) - System design
   - [COMMANDS.md](COMMANDS.md) - All commands

3. **Try API Endpoints**
   - Use Postman collection
   - Check [API Documentation](README.md#api-documentation)

4. **Customize**
   - Update branding
   - Add new features
   - Deploy to production

---

## 💡 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# Access database
docker-compose exec mysql mysql -u admin -p

# Run tests
cd backend && npm test
```

---

## 🎓 Learn More

- **MVC Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **API Details**: See [README.md](README.md#api-documentation)
- **Deploy to Production**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **All Commands**: See [COMMANDS.md](COMMANDS.md)

---

## ✅ Health Check

Verify everything is working:

```bash
# Check health endpoint
curl http://localhost:5000/health

# Should return: {"status":"OK","timestamp":"..."}
```

---

## 🆘 Need Help?

1. Check [README.md](README.md) troubleshooting section
2. View [COMMANDS.md](COMMANDS.md) for all commands
3. Check Docker logs: `docker-compose logs -f`
4. Review [ARCHITECTURE.md](ARCHITECTURE.md) for design details

---

## 🎉 Success!

If you can:
- ✅ Access the customer portal
- ✅ Login to admin dashboard
- ✅ See sample data
- ✅ Create a service request

**Congratulations! You're all set! 🚀**

---

**Enjoy building with the Service Request Management System!**

For detailed information, see [README.md](README.md)
