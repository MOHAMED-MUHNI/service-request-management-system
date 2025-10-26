# 🚀 Deployment Guide - Service Request App

Complete guide for deploying the Service Request Management System to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment Options](#cloud-deployment-options)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Security Checklist](#security-checklist)
- [Monitoring & Logging](#monitoring--logging)

## Prerequisites

### Required
- Docker & Docker Compose (for containerized deployment)
- MySQL 8.0+ (for standalone deployment)
- Node.js 18+ (for standalone deployment)
- Domain name (optional, for production)
- SSL certificate (recommended for production)

### Recommended
- Linux server (Ubuntu 20.04+ or CentOS 8+)
- At least 2GB RAM
- 20GB disk space
- Firewall configured

## Docker Deployment

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Clone Repository

```bash
# Clone your repository
git clone <your-repository-url>
cd internTask

# Or upload files via SCP/SFTP
```

### Step 3: Configure Environment

```bash
# Create production environment file
cp .env.example .env
nano .env

# Update with production values
# See "Environment Variables" section below
```

### Step 4: Update Docker Compose

Edit `docker-compose.yml` for production:

```yaml
# Change MySQL password
MYSQL_ROOT_PASSWORD: <strong-password>
MYSQL_PASSWORD: <strong-password>

# Update JWT secret
JWT_SECRET: <generate-random-secure-string>

# Update CORS origin
CORS_ORIGIN: https://yourdomain.com
```

### Step 5: Deploy

```bash
# Build and start services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# The app should be running on:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:5000
# - Nginx: http://localhost:80
```

### Step 6: Setup Reverse Proxy (Production)

For production with a domain, use Nginx on the host:

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/service-request-app

# Add configuration (see below)
sudo ln -s /etc/nginx/sites-available/service-request-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Production Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }
}
```

### Step 7: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## Cloud Deployment Options

### AWS (Amazon Web Services)

**Option 1: EC2 Instance**
```bash
1. Launch EC2 instance (Ubuntu 20.04, t2.medium)
2. Configure security group (ports 80, 443, 22)
3. Follow Docker deployment steps above
4. Use Route 53 for DNS
5. Use ACM for SSL certificates
```

**Option 2: ECS (Elastic Container Service)**
```bash
1. Create ECR repositories for frontend and backend
2. Push Docker images to ECR
3. Create ECS task definitions
4. Create ECS service with load balancer
5. Use RDS for MySQL database
```

**Option 3: Elastic Beanstalk**
```bash
1. Create new Elastic Beanstalk application
2. Use Docker platform
3. Upload docker-compose.yml
4. Configure environment variables
5. Setup RDS for database
```

### Google Cloud Platform (GCP)

**Option 1: Compute Engine**
```bash
1. Create VM instance (Ubuntu, e2-medium)
2. Configure firewall rules
3. Follow Docker deployment steps
4. Use Cloud SQL for MySQL
5. Use Cloud DNS for domain
```

**Option 2: Cloud Run**
```bash
1. Build container images
2. Push to Container Registry
3. Deploy each service to Cloud Run
4. Use Cloud SQL for database
5. Configure Cloud Load Balancer
```

### Azure

**Option 1: Virtual Machine**
```bash
1. Create Ubuntu VM
2. Configure network security group
3. Follow Docker deployment steps
4. Use Azure Database for MySQL
5. Use Azure DNS
```

**Option 2: Container Instances**
```bash
1. Create Azure Container Registry
2. Push images to ACR
3. Deploy container groups
4. Use Azure Database for MySQL
5. Setup Application Gateway
```

### DigitalOcean

**Recommended: Droplet + Managed Database**
```bash
1. Create Droplet (Ubuntu, 2GB RAM)
2. Create Managed MySQL Database
3. Follow Docker deployment steps
4. Update DB connection to managed database
5. Use DigitalOcean DNS
6. Setup firewall with cloud firewall
```

### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create apps
heroku create your-app-backend
heroku create your-app-frontend

# Add MySQL addon
heroku addons:create jawsdb:kitefin -a your-app-backend

# Deploy backend
cd backend
git init
heroku git:remote -a your-app-backend
git add .
git commit -m "Deploy"
git push heroku master

# Deploy frontend (similar process)
```

## Environment Variables

### Production Environment Variables

**Backend (.env):**
```env
# Environment
NODE_ENV=production

# Server
PORT=5000

# Database (use managed database in production)
DB_HOST=your-managed-db-host.com
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=<strong-secure-password>
DB_NAME=service_requests_db

# JWT (CRITICAL: Generate a strong secret)
JWT_SECRET=<generate-with: openssl rand -base64 64>
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=https://yourdomain.com

# Optional: Email service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=<app-specific-password>
```

**Frontend (.env):**
```env
REACT_APP_API_URL=https://yourdomain.com/api
```

### Generating Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 64

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate strong password
openssl rand -base64 32
```

## Database Setup

### Production Database Recommendations

**Option 1: Managed Database (Recommended)**
- AWS RDS
- Google Cloud SQL
- Azure Database for MySQL
- DigitalOcean Managed Databases

Benefits:
- Automatic backups
- High availability
- Automatic updates
- Monitoring included
- Easy scaling

**Option 2: Self-Hosted MySQL**

```bash
# Install MySQL
sudo apt install mysql-server -y

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql
CREATE DATABASE service_requests_db;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON service_requests_db.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Run migrations
cd backend
npm run migrate
npm run seed
```

### Database Backups

**Automated Backup Script:**
```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="service_requests_db"
DB_USER="admin"
DB_PASS="your-password"

mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/db_backup_$DATE.sql s3://your-bucket/backups/
```

**Setup Cron Job:**
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

## Security Checklist

### ✅ Pre-Deployment Security

- [ ] Change default admin password
- [ ] Generate strong JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Update all dependencies
- [ ] Remove development dependencies
- [ ] Disable debug modes
- [ ] Setup firewall rules
- [ ] Enable rate limiting (optional)

### ✅ Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Only allow database from backend
sudo ufw allow from <backend-ip> to any port 3306
```

### ✅ Environment Hardening

```bash
# Disable root SSH login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart sshd

# Setup fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Monitoring & Logging

### Application Logs

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Backend logs location
backend/logs/error.log
backend/logs/combined.log
```

### Setup Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/service-request-app

# Add:
/path/to/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
}
```

### Monitoring Tools

**Option 1: PM2 (for Node.js)**
```bash
npm install -g pm2

# Start app with PM2
cd backend
pm2 start src/server.js --name service-request-api

# Monitor
pm2 monit

# Setup startup script
pm2 startup
pm2 save
```

**Option 2: Docker Health Checks**
Already configured in docker-compose.yml

**Option 3: External Monitoring**
- Uptime Robot (free)
- Pingdom
- New Relic
- Datadog

## Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Or with zero downtime
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

### Database Migrations

```bash
# Run new migrations
docker-compose exec backend npm run migrate
```

### Scaling

**Horizontal Scaling:**
```yaml
# docker-compose.yml
backend:
  deploy:
    replicas: 3
```

**Load Balancer:**
Use Nginx, HAProxy, or cloud load balancers

## Troubleshooting Production Issues

### Common Issues

**1. Can't connect to database**
```bash
# Check MySQL is running
docker-compose ps mysql

# Check connection
docker-compose exec backend npm run test-db
```

**2. 502 Bad Gateway**
```bash
# Check backend is running
docker-compose logs backend

# Restart services
docker-compose restart backend
```

**3. High memory usage**
```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart
```

## Rollback Procedure

```bash
# If deployment fails, rollback:

# 1. Stop current version
docker-compose down

# 2. Checkout previous version
git checkout <previous-commit-hash>

# 3. Rebuild and start
docker-compose up -d --build

# 4. Restore database backup if needed
mysql -u admin -p service_requests_db < backup.sql
```

## Success Criteria

Your deployment is successful when:
- ✅ All services are running
- ✅ HTTPS is working
- ✅ Database connections are stable
- ✅ Frontend loads correctly
- ✅ API responds to requests
- ✅ Authentication works
- ✅ No errors in logs
- ✅ Backups are configured
- ✅ Monitoring is active

---

**Congratulations! Your Service Request App is now deployed! 🎉**

For support, refer to:
- [README.md](README.md) - General documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
- [QUIZ_ANSWERS.md](QUIZ_ANSWERS.md) - Technical details
