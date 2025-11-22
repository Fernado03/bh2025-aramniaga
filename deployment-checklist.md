# Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment
- [ ] All code tested locally
- [ ] Environment variables documented
- [ ] `.env` files are in `.gitignore`
- [ ] Code pushed to GitHub repository

## Backend Deployment (Render)
- [ ] Render account created
- [ ] New Web Service created
- [ ] Repository connected to Render
- [ ] Build settings configured:
  - [ ] Root Directory: `server`
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
- [ ] Environment variables added:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `GEMINI_API_KEY`
  - [ ] `PORT`
  - [ ] `GEMINI_MODEL`
  - [ ] `GEMINI_VISION_MODEL`
  - [ ] `GEMINI_FAST_MODEL`
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `_______________________________`

## Frontend Deployment (Vercel)
- [ ] Vercel account created
- [ ] New Project created
- [ ] Repository connected to Vercel
- [ ] Build settings configured:
  - [ ] Root Directory: `client`
  - [ ] Framework: Vite
  - [ ] Build Command: `npm run build`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` (Render backend URL)
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `_______________________________`

## Post-Deployment Configuration
- [ ] Update `CLIENT_URL` in Render with Vercel URL
- [ ] Backend redeployed with updated CORS settings
- [ ] MongoDB Atlas IP whitelist configured (0.0.0.0/0)

## Testing
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays correctly
- [ ] AI features working:
  - [ ] Photo Analysis (Day 3)
  - [ ] Hashtag Generator (Day 5)
  - [ ] Story Canvas (Day 6)
  - [ ] Bio Generator
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls

## Monitoring
- [ ] Render logs checked for errors
- [ ] Vercel deployment logs reviewed
- [ ] Error monitoring set up (optional)

## Optional Enhancements
- [ ] Custom domain configured for frontend
- [ ] Custom domain configured for backend
- [ ] SSL certificates verified
- [ ] Database backups scheduled
- [ ] Performance monitoring enabled

---

## Important URLs

**Frontend (Vercel):** `_______________________________`

**Backend (Render):** `_______________________________`

**MongoDB Atlas:** `https://cloud.mongodb.com/`

**GitHub Repo:** `_______________________________`

---

## Quick Commands

### Test Backend Locally
```bash
cd server
npm install
npm run dev
```

### Test Frontend Locally
```bash
cd client
npm install
npm run dev
```

### Build Frontend for Production
```bash
cd client
npm run build
```

---

## Emergency Rollback

If deployment fails:

1. **Vercel:** Go to Deployments → Select previous working deployment → Click "Promote to Production"
2. **Render:** Go to Events → Select previous successful deploy → Click "Redeploy"
