# 🚀 GitHub Repository Setup Guide

## Step 1: Create Repository on GitHub

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name:** `service-request-management-system`
   - **Description:** `Complete Service Request Management System with Node.js, React, MySQL, and Docker`
   - **Visibility:** Public (or Private)
   - **DO NOT** check any initialization options
3. Click "Create repository"

## Step 2: Push Code to GitHub

After creating the repository, run these commands in PowerShell:

```powershell
# Set the default branch to main
git branch -M main

# Add your GitHub repository as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/MOHAMED-MUHNI/service-request-management-system.git

# Push the code
git push -u origin main
```

**Note:** You may be prompted to login to GitHub. Use your credentials when asked.

## Step 3: Verify on GitHub

Go to: https://github.com/MOHAMED-MUHNI/service-request-management-system

You should see all your files uploaded! ✅

---

## 🐳 Docker Hub Setup (Since you connected GitHub to Docker Desktop)

### Option A: Automated Builds via GitHub Actions

Create `.github/workflows/docker-publish.yml`:

```yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_TOKEN }}
    
    - name: Build and push Backend
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/service-request-backend:latest
    
    - name: Build and push Frontend
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/service-request-frontend:latest
```

### Option B: Manual Docker Push

```powershell
# Login to Docker Hub
docker login

# Build images with your Docker Hub username
docker build -t YOUR_DOCKERHUB_USERNAME/service-request-backend:latest ./backend
docker build -t YOUR_DOCKERHUB_USERNAME/service-request-frontend:latest ./frontend

# Push to Docker Hub
docker push YOUR_DOCKERHUB_USERNAME/service-request-backend:latest
docker push YOUR_DOCKERHUB_USERNAME/service-request-frontend:latest
```

---

## 📋 Quick Commands Reference

### Check Git Status
```powershell
git status
```

### Make Changes and Commit
```powershell
git add .
git commit -m "Your commit message"
git push
```

### Pull Latest Changes
```powershell
git pull
```

### View Remote URL
```powershell
git remote -v
```

### Change Remote URL (if needed)
```powershell
git remote set-url origin https://github.com/YOUR_USERNAME/REPO_NAME.git
```

---

## 🔐 GitHub Authentication

If you get authentication errors, you have two options:

### Option 1: Personal Access Token (Recommended)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: "Service Request App"
4. Select scopes: `repo`, `workflow`
5. Click "Generate token"
6. Copy the token
7. When pushing, use the token as your password

### Option 2: GitHub CLI
```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Login
gh auth login

# Follow the prompts
```

---

## ✅ Verification Checklist

After pushing to GitHub, verify:

- [ ] All 58 files are visible on GitHub
- [ ] README.md displays correctly on the repository page
- [ ] .gitignore is working (no node_modules, .env files)
- [ ] Repository description is set
- [ ] Topics/tags are added (optional but recommended)

### Recommended GitHub Topics:
- `nodejs`
- `react`
- `express`
- `mysql`
- `docker`
- `service-management`
- `fullstack`
- `jwt-authentication`

---

## 🎨 Make Your Repository Stand Out

### 1. Add Topics (Tags)
Go to repository settings and add relevant topics.

### 2. Add a Repository Description
Click "Edit" next to "About" on your repository page.

### 3. Add Repository Social Preview
Go to Settings → Options → Social preview → Upload image

### 4. Enable GitHub Pages (for documentation)
Settings → Pages → Deploy from main branch

### 5. Add Badges to README
```markdown
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)
```

---

## 🚀 Next Steps

1. Push code to GitHub ✅
2. Add topics and description
3. Set up GitHub Actions for CI/CD (optional)
4. Deploy to production (see DEPLOYMENT.md)
5. Share your repository!

---

## 💡 Useful Links

- Your Repository: https://github.com/MOHAMED-MUHNI/service-request-management-system
- GitHub Help: https://docs.github.com
- Docker Hub: https://hub.docker.com
- GitHub Actions: https://github.com/features/actions

---

**Need help? Check the error messages carefully and refer to this guide!**
