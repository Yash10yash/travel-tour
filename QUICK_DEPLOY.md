# 🚀 Quick Deployment Checklist

## Backend (Render) - Environment Variables

Copy these to Render Dashboard → Environment Variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://yg745192_db_user:yash123@cluster0.ds4nyes.mongodb.net/travel_tour?appName=Cluster0
JWT_SECRET=o9JeHpSZcR14FilOQtkWxYsvNTj7LI8nMGzwKB3U6Cd52ADXhEPmqrV0ybfagu
JWT_EXPIRE=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yash971331@gmail.com
EMAIL_PASS=Yash@2004
EMAIL_FROM=Travel Tour
ADMIN_EMAIL=admin@traveltour.com
ADMIN_PASSWORD=admin@123
```

**Note**: Update `FRONTEND_URL` after you get your Vercel URL!

---

## Frontend (Vercel) - Environment Variables

Add this in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-render-app.onrender.com/api
```

**Note**: Replace `your-render-app` with your actual Render service name!

---

## Deployment Steps Summary

### 1. Backend (Render)
1. Push code to GitHub
2. Go to Render → New Web Service
3. Connect GitHub repo
4. Set Root Directory: `server`
5. Add all environment variables above
6. Deploy!

### 2. Frontend (Vercel)
1. Go to Vercel → New Project
2. Import GitHub repo
3. Set Root Directory: `client`
4. Add `VITE_API_URL` environment variable
5. Deploy!

### 3. Update CORS
1. Get your Vercel URL
2. Update `FRONTEND_URL` in Render
3. Redeploy backend

### 4. Initialize Admin
Visit: `https://your-render-app.onrender.com/api/admin/init`

---

## Important Notes

- ✅ `.env` files are gitignored (won't be committed)
- ✅ Configuration files are ready (`vercel.json`, `render.yaml`)
- ⚠️ Update `FRONTEND_URL` after Vercel deployment
- ⚠️ Update `VITE_API_URL` with your Render URL
- ⚠️ Render free tier spins down after 15 min inactivity

