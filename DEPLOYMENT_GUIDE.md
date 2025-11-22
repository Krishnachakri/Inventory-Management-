# 🚀 Complete Deployment Guide

This guide will help you deploy the Inventory Management System to production.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a public GitHub repository
2. **Render Account** (for backend) - Sign up at [render.com](https://render.com)
3. **Vercel Account** (for frontend) - Sign up at [vercel.com](https://vercel.com)

---

## 🔧 Step 1: Prepare Your GitHub Repository

### Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Inventory Management System"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/inventory-management-app.git

# Push to GitHub
git push -u origin main
```

---

## 🖥️ Step 2: Deploy Backend (Render)

### Option A: Using Render Dashboard

1. **Go to Render Dashboard**: [https://dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**:
   - **Name**: `inventory-management-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to you

4. **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (or leave blank - Render sets this)
   - `JWT_SECRET` = `your-super-secret-jwt-key-change-this-in-production`

5. **Click "Create Web Service"**

6. **Note Your Backend URL**: 
   - Example: `https://inventory-management-backend.onrender.com`
   - Save this URL - you'll need it for frontend deployment

### Option B: Using Render CLI (Alternative)

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy
cd backend
render deploy
```

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### Option A: Using Vercel Dashboard

1. **Go to Vercel Dashboard**: [https://vercel.com](https://vercel.com)

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Create React App`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   - Add this variable:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`
   - (Replace with your actual backend URL from Step 2)

5. **Click "Deploy"**

6. **Note Your Frontend URL**:
   - Example: `https://inventory-management-app.vercel.app`

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel

# Set environment variable
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.onrender.com

# Redeploy
vercel --prod
```

---

## 🔗 Step 4: Update API URL in Frontend

After deploying the backend, update the frontend environment variable:

1. **In Vercel Dashboard**:
   - Go to your project → Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your backend URL
   - Redeploy the frontend

---

## ✅ Step 5: Test Your Deployment

1. **Test Backend**:
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK","message":"Server is running"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try to register/login
   - Test all features

---

## 📝 Alternative Deployment Options

### Backend Alternatives:

#### **Railway**:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

#### **Fly.io**:
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch
cd backend
fly launch
```

### Frontend Alternatives:

#### **Netlify**:
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `frontend/build` folder OR
3. Connect GitHub repository
4. Set:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: `frontend`
5. Add environment variable: `REACT_APP_API_URL`

---

## 🔐 Important Security Notes

1. **Change JWT Secret**: 
   - Don't use the default JWT secret in production
   - Generate a strong secret: `openssl rand -base64 32`

2. **Enable HTTPS**: 
   - Both Render and Vercel provide HTTPS by default

3. **CORS**: 
   - Backend CORS is configured to allow all origins
   - For production, restrict to your frontend domain

---

## 🐛 Troubleshooting

### Backend Issues:

1. **Database not persisting**:
   - Render free tier may reset the database
   - Consider using Render PostgreSQL (free tier available)

2. **Port issues**:
   - Render sets PORT automatically
   - Make sure your code uses `process.env.PORT || 5000`

### Frontend Issues:

1. **API connection failed**:
   - Check `REACT_APP_API_URL` environment variable
   - Verify backend URL is correct
   - Check browser console for CORS errors

2. **Build fails**:
   - Check Node version (should be 18+)
   - Clear `node_modules` and reinstall

---

## 📊 Post-Deployment Checklist

- [ ] Backend health check working
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Products CRUD operations work
- [ ] CSV import/export works
- [ ] Pagination works
- [ ] Sorting works
- [ ] Advanced filters work
- [ ] Data visualization displays correctly
- [ ] Responsive design works on mobile

---

## 🎉 Submission Format

Once deployed, submit:

```
GitHub Repository: https://github.com/YOUR_USERNAME/inventory-management-app
Live Backend URL: https://your-backend.onrender.com
Live Frontend URL: https://your-frontend.vercel.app
```

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Issues**: Check your repository issues

---

**Good luck with your deployment! 🚀**

