# 📋 Development Commands Cheat Sheet

Quick reference for common development tasks.

## 🚀 Quick Start

```bash
# One-command start with Docker
docker-compose up -d

# Or local development
npm run dev
```

## 📦 Installation

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all

# Install individually
npm install              # Root
cd backend && npm install
cd frontend && npm install
```

## 🏃 Running the Application

### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Run separately
npm run dev:backend      # Backend only
npm run dev:frontend     # Frontend only

# Or manually
cd backend && npm run dev
cd frontend && npm start
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

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Start with build
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Restart a service
docker-compose restart backend

# Rebuild specific service
docker-compose up -d --no-deps --build backend

# Execute command in container
docker-compose exec backend npm run migrate
docker-compose exec mysql mysql -u admin -p
```

## 🗄️ Database Commands

```bash
# Run migrations
cd backend
npm run migrate

# Seed database with sample data
npm run seed

# Access MySQL CLI
mysql -u admin -p service_requests_db

# Or with Docker
docker-compose exec mysql mysql -u admin -p service_requests_db

# Backup database
mysqldump -u admin -p service_requests_db > backup.sql

# Restore database
mysql -u admin -p service_requests_db < backup.sql

# Reset database (caution!)
mysql -u admin -p
DROP DATABASE service_requests_db;
CREATE DATABASE service_requests_db;
EXIT;
npm run migrate
npm run seed
```

## 🧪 Testing

```bash
# Run all tests
cd backend
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- api.test.js
npm test -- unit.test.js

# Run tests in watch mode
npm test -- --watch

# Run tests with verbose output
npm test -- --verbose
```

## 🔍 Code Quality

```bash
# Lint all code
npm run lint

# Lint specific directory
cd backend && npm run lint
cd frontend && npm run lint

# Format all code
npm run format

# Check format without writing
prettier --check "**/*.{js,jsx,json,css,md}"
```

## 📊 Logs

```bash
# View backend logs (Winston)
tail -f backend/logs/error.log
tail -f backend/logs/combined.log

# Clear logs
rm backend/logs/*.log

# Docker logs
docker-compose logs -f --tail=100 backend
```

## 🔧 Troubleshooting

```bash
# Kill processes on specific ports
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9

# Check what's running on a port
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3000
lsof -i :5000

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Docker cleanup
docker system prune -a --volumes
docker-compose down -v
docker-compose up -d --build
```

## 🌐 API Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test login (PowerShell)
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

# Test with saved token (PowerShell)
$token = "your-jwt-token-here"
$headers = @{
    Authorization = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/service-requests" -Headers $headers

# Or use the Postman collection
# Import postman_collection.json into Postman
```

## 🛠️ Makefile Commands

```bash
# View all available commands
make help

# Install dependencies
make install

# Run development servers
make dev

# Build production
make build

# Run tests
make test

# Run migrations
make migrate

# Seed database
make seed

# Docker commands
make docker-up
make docker-down
make docker-build

# Clean everything
make clean
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Update from main
git checkout main
git pull origin main
git checkout feature/your-feature-name
git merge main

# Squash commits before merge
git rebase -i HEAD~3
```

## 🔄 Common Workflows

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# Edit files...

# 3. Test locally
npm run dev
npm test

# 4. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 5. Create pull request
```

### Fixing a Bug

```bash
# 1. Create bugfix branch
git checkout -b bugfix/fix-issue

# 2. Reproduce bug and fix
npm run dev

# 3. Add tests
# Add test to backend/src/tests/

# 4. Run tests
npm test

# 5. Commit and push
git add .
git commit -m "fix: resolve issue with..."
git push origin bugfix/fix-issue
```

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages
npm update

# Update major versions
npm install package-name@latest

# Security audit
npm audit
npm audit fix
```

## 🚨 Emergency Commands

```bash
# Stop everything
docker-compose down
pkill node

# Reset to clean state
docker-compose down -v
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules
npm run install:all
docker-compose up -d --build

# Restore from backup
mysql -u admin -p service_requests_db < backup.sql

# Rollback to previous version
git log
git checkout <previous-commit-hash>
docker-compose up -d --build
```

## 📱 Frontend Specific

```bash
cd frontend

# Start dev server
npm start

# Build for production
npm run build

# Serve production build locally
npx serve -s build

# Clear React cache
rm -rf node_modules/.cache

# Analyze bundle size
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

## 🔙 Backend Specific

```bash
cd backend

# Start with nodemon
npm run dev

# Start in production
npm start

# Generate migration (if using migration tool)
npm run migration:generate

# Revert migration
npm run migration:revert

# Check code coverage
npm test -- --coverage --verbose
```

## 📊 Performance Monitoring

```bash
# Check Docker resource usage
docker stats

# Check disk usage
df -h

# Check memory usage
free -h

# Monitor logs in real-time
tail -f backend/logs/combined.log

# Check database size
mysql -u admin -p -e "
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
"
```

## 🔐 Security Commands

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update passwords
mysql -u root -p
ALTER USER 'admin'@'localhost' IDENTIFIED BY 'new-strong-password';
FLUSH PRIVILEGES;

# Generate secure random string
openssl rand -base64 32

# Check SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

## 📚 Documentation

```bash
# Generate API docs (if added JSDoc)
npx jsdoc -c jsdoc.json

# View README
cat README.md

# Search in files
grep -r "search-term" backend/src/
grep -r "search-term" frontend/src/

# Count lines of code
find backend/src -name "*.js" | xargs wc -l
find frontend/src -name "*.js" | xargs wc -l
```

## 🎯 Useful Aliases (Add to .bashrc or .zshrc)

```bash
# Add these to your shell config

# Development
alias dev="npm run dev"
alias devb="cd backend && npm run dev"
alias devf="cd frontend && npm start"

# Docker
alias dup="docker-compose up -d"
alias ddown="docker-compose down"
alias dlogs="docker-compose logs -f"
alias dps="docker-compose ps"

# Git
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"
alias gl="git log --oneline"

# Testing
alias test="cd backend && npm test"
alias testw="cd backend && npm test -- --watch"

# Database
alias migrate="cd backend && npm run migrate"
alias seed="cd backend && npm run seed"
```

---

## 💡 Tips

1. **Always run tests before committing**
   ```bash
   npm test && git commit
   ```

2. **Use Docker for consistent environment**
   ```bash
   docker-compose up -d
   ```

3. **Check logs when something breaks**
   ```bash
   docker-compose logs -f
   ```

4. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

5. **Use Postman collection for API testing**
   - Import `postman_collection.json`
   - Run "Login" first to get token

---

**Happy Developing! 🚀**
