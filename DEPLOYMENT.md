# 🚀 Deployment Guide

This guide will help you deploy the Travel Tour website to **Vercel (Frontend)** and **Render (Backend)**.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (for database)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend

1. Make sure your `server/.env` file has all required variables (don't commit this file)

2. Create a `render.yaml` file in the server directory (already created)

### Step 2: Push to GitHub

1. Create a new repository on GitHub (e.g., `travel-tour`)

2. Initialize and push your code:
   ```bash
   # Initialize git (if not already done)
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Travel Tour Booking Website"
   
   # Set main branch
   git branch -M main
   
   # Add remote (replace with your GitHub repo URL)
   git remote add origin https://github.com/yourusername/travel-tour.git
   
   # Push to GitHub
   git push -u origin main
   ```

**Important**: Make sure `.env` files are not committed (they're in `.gitignore`)

### Step 3: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `travel-tour-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-vercel-app.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   EMAIL_FROM=Travel Tour
   ADMIN_EMAIL=admin@traveltour.com
   ADMIN_PASSWORD=admin@123
   RAZORPAY_KEY_ID=your_razorpay_key_id (optional)
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret (optional)
   ```

6. Click "Create Web Service"
7. Wait for deployment (takes 5-10 minutes)
8. Copy your Render URL (e.g., `https://travel-tour-api.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment Variables

1. Create `client/.env.production` file:
   ```env
   VITE_API_URL=https://your-render-app.onrender.com/api
   ```

2. **Important**: Add `.env.production` to `.gitignore` if it contains secrets, or use Vercel's environment variables instead.

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (IMPORTANT: Set this!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://travel-tour-ivfg.onrender.com/api
     ```
     - Select all environments (Production, Preview, Development)
     - Click "Add"

6. Click "Deploy"
7. Wait for deployment (takes 2-5 minutes)
8. Copy your Vercel URL (e.g., `https://travel-tour.vercel.app`)

#### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to client directory:
   ```bash
   cd client
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name? `travel-tour`
   - Directory? `./`
   - Override settings? **No**

5. Add environment variable:
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://travel-tour-ivfg.onrender.com/api
   ```

---

## Part 3: Update Backend CORS

After getting your Vercel URL, update the backend:

1. Go to Render Dashboard → Your Web Service → Environment
2. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy the service

---

## Part 4: Initialize Admin User

After deployment, initialize the admin user:

1. Go to: `https://your-render-app.onrender.com/api/admin/init`
2. Or use the API endpoint via Postman/curl:
   ```bash
   curl -X POST https://your-render-app.onrender.com/api/admin/init
   ```

Admin credentials:
- Email: `admin@traveltour.com` (or from ADMIN_EMAIL env var)
- Password: `admin@123` (or from ADMIN_PASSWORD env var)

---

## Part 5: Final Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] MongoDB Atlas connection string configured
- [ ] All environment variables set in Render
- [ ] Frontend API URL updated in Vercel
- [ ] CORS updated with Vercel URL
- [ ] Admin user initialized
- [ ] Test login functionality
- [ ] Test contact form
- [ ] Test booking flow (if payment is configured)

---

## Troubleshooting

### Backend Issues

1. **Build fails**: Check Render logs for missing dependencies
2. **Database connection fails**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
3. **CORS errors**: Ensure `FRONTEND_URL` is set correctly in Render

### Frontend Issues

1. **API calls fail**: Check `VITE_API_URL` in Vercel environment variables
2. **Build fails**: Check Vercel build logs
3. **404 on routes**: Ensure `vercel.json` has proper rewrites

### Common Issues

- **Render free tier**: Services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.
- **Environment variables**: Make sure all required variables are set in both platforms
- **HTTPS**: Both platforms use HTTPS by default, ensure your API URLs use `https://`

---

## URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`
- **API Health Check**: `https://your-api.onrender.com/api/health`

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Verify all environment variables are set correctly

