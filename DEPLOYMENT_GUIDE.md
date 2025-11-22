# 🚀 Deployment Guide: Vercel + Render

This guide provides step-by-step instructions to deploy your application with:
- **Vercel** for the frontend (React + Vite)
- **Render** for the backend (Node.js + Express + MongoDB)

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. ✅ A [GitHub](https://github.com) account
2. ✅ A [Vercel](https://vercel.com) account (sign up with GitHub)
3. ✅ A [Render](https://render.com) account (sign up with GitHub)
4. ✅ Your code pushed to a GitHub repository
5. ✅ All environment variables ready (API keys, MongoDB URI, etc.)

---

## Part 1: Preparing Your Code for Deployment

### Step 1.1: Push Your Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 1.2: Verify Backend Configuration

Ensure your backend `server.js` is configured correctly:

```javascript
// server.js should use environment PORT
const PORT = process.env.PORT || 5000;

// CORS should allow your Vercel frontend URL
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Step 1.3: Create Production Build Script

Verify your `client/package.json` has the build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Part 2: Deploy Backend to Render

### Step 2.1: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button in the top right
3. Select **"Web Service"**

### Step 2.2: Connect Your GitHub Repository

1. Click **"Connect account"** to authorize Render with GitHub
2. Find and select your repository (`bh2025`)
3. Click **"Connect"**

### Step 2.3: Configure the Web Service

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `bh2025-backend` (or your preferred name) |
| **Region** | Choose closest to your users (e.g., Singapore) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid plan) |

### Step 2.4: Add Environment Variables

In the **Environment Variables** section, click **"Add Environment Variable"** and add each of the following:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGO_URI` | Your MongoDB connection string | From MongoDB Atlas |
| `JWT_SECRET` | Your JWT secret key | Same as local `.env` |
| `GEMINI_API_KEY` | Your Google Gemini API key | From Google AI Studio |
| `PORT` | `5000` | Or any port you prefer |
| `GEMINI_MODEL` | `gemini-2.0-flash-exp` | Or your preferred model |
| `GEMINI_VISION_MODEL` | `gemini-2.0-flash-exp` | For image analysis |
| `GEMINI_FAST_MODEL` | `gemini-2.0-flash-exp` | For fast responses |
| `CLIENT_URL` | Will add after frontend deployment | Leave empty for now |

> [!IMPORTANT]
> Copy your **MongoDB URI** from MongoDB Atlas. It should look like:
> `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### Step 2.5: Deploy the Backend

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your backend
3. Wait for the deployment to complete (2-5 minutes)
4. Once deployed, you'll see a URL like: `https://bh2025-backend.onrender.com`

### Step 2.6: Test the Backend

Open your backend URL in a browser:
- Test endpoint: `https://bh2025-backend.onrender.com/api/test` (or similar)
- You should see a response if your API has a test route

> [!WARNING]
> Render's free tier spins down after 15 minutes of inactivity. The first request after inactivity may take 30-60 seconds to respond.

---

## Part 3: Deploy Frontend to Vercel

### Step 3.1: Create API Configuration File

Before deploying, create a configuration file for your API endpoint:

**Create `client/src/config/api.js`:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
```

**Update your API calls to use this config:**

In your React components, replace hardcoded API URLs:

```javascript
// Before
const response = await fetch('http://localhost:5000/api/...');

// After
import API_URL from '../config/api';
const response = await fetch(`${API_URL}/api/...`);
```

### Step 3.2: Create a New Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**

### Step 3.3: Import Your Repository

1. Click **"Continue with GitHub"** (if not already connected)
2. Find and select your repository (`bh2025`)
3. Click **"Import"**

### Step 3.4: Configure the Project

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | `client` |
| **Build Command** | `npm run build` (auto-filled) |
| **Output Directory** | `dist` (auto-filled) |
| **Install Command** | `npm install` (auto-filled) |

### Step 3.5: Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL (e.g., `https://bh2025-backend.onrender.com`) |

> [!TIP]
> Click **"Add"** after entering each environment variable.

### Step 3.6: Deploy the Frontend

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://bh2025.vercel.app`

### Step 3.7: Update Backend CORS

Now that you have your frontend URL, go back to Render:

1. Open your Render dashboard
2. Go to your backend web service
3. Click **"Environment"** in the left sidebar
4. Add or update the `CLIENT_URL` environment variable:
   - **Key**: `CLIENT_URL`
   - **Value**: Your Vercel URL (e.g., `https://bh2025.vercel.app`)
5. Click **"Save Changes"**
6. Render will automatically redeploy with the new environment variable

---

## Part 4: Verify Deployment

### Step 4.1: Test the Deployed Application

1. Open your Vercel URL: `https://bh2025.vercel.app`
2. Try to:
   - ✅ Register a new account
   - ✅ Login
   - ✅ Navigate through different pages
   - ✅ Test AI features (photo analysis, hashtag generation, etc.)

### Step 4.2: Check Browser Console

1. Open browser DevTools (F12)
2. Check the **Console** tab for any errors
3. Check the **Network** tab to ensure API calls are successful

### Step 4.3: Monitor Logs

**Render Backend Logs:**
1. Go to Render Dashboard → Your Web Service
2. Click **"Logs"** tab
3. Monitor for any errors during API requests

**Vercel Frontend Logs:**
1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** → Latest deployment
3. Click **"View Function Logs"** (if using serverless functions)

---

## Part 5: Custom Domain (Optional)

### Step 5.1: Add Custom Domain to Vercel

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Enter your custom domain (e.g., `yourdomain.com`)
4. Follow Vercel's instructions to configure DNS records

### Step 5.2: Add Custom Domain to Render

1. In Render Dashboard, go to your web service
2. Click **"Settings"** → **"Custom Domains"**
3. Enter your custom backend domain (e.g., `api.yourdomain.com`)
4. Follow Render's instructions to configure DNS records

### Step 5.3: Update Environment Variables

After setting up custom domains:

**On Render:**
- Update `CLIENT_URL` to your custom frontend domain

**On Vercel:**
- Update `VITE_API_URL` to your custom backend domain

---

## 🔧 Troubleshooting

### Issue: API Calls Failing with CORS Error

**Solution:**
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly
2. Ensure your backend has CORS configured:
   ```javascript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```

### Issue: Environment Variables Not Working

**Solution:**
1. Ensure all environment variable names are correct
2. Redeploy after adding environment variables
3. For Vite, environment variables must start with `VITE_`

### Issue: Build Failing on Vercel

**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Test build locally: `npm run build` in the `client` directory

### Issue: Backend Takes Long to Respond (Render Free Tier)

**Solution:**
1. This is normal for Render's free tier (cold starts)
2. Consider upgrading to a paid plan for always-on instances
3. Implement a health check endpoint and ping it regularly

### Issue: MongoDB Connection Failed

**Solution:**
1. Verify MongoDB Atlas allows connections from anywhere (IP: `0.0.0.0/0`)
2. Check MongoDB URI is correct in Render environment variables
3. Ensure database user has proper permissions

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

### Auto-Deploy on Git Push

1. **Vercel**: Every push to `main` branch automatically deploys
2. **Render**: Every push to `main` branch automatically deploys

### Deploy from a Specific Branch

- **Vercel**: Settings → Git → Production Branch
- **Render**: Settings → Build & Deploy → Branch

---

## 💡 Best Practices

1. **Use Environment Variables**: Never hardcode API keys or secrets
2. **Enable HTTPS**: Both platforms provide free SSL certificates
3. **Monitor Logs**: Regularly check deployment logs for errors
4. **Test Locally First**: Always test changes locally before deploying
5. **Use .gitignore**: Ensure `.env` files are not committed to Git
6. **Set Up Alerts**: Configure error monitoring (Sentry, LogRocket, etc.)
7. **Database Backups**: Regularly backup your MongoDB database

---

## 📊 Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables prepared
- [ ] Backend deployed to Render
- [ ] Backend environment variables configured
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables configured
- [ ] Backend `CLIENT_URL` updated with Vercel URL
- [ ] Application tested in production
- [ ] Custom domains configured (optional)
- [ ] Monitoring and logging set up

---

## 🆘 Need Help?

- **Vercel Documentation**: https://vercel.com/docs
- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

## 🎉 Congratulations!

Your application is now live! Share your deployment URLs:
- **Frontend**: `https://bh2025.vercel.app`
- **Backend**: `https://bh2025-backend.onrender.com`

Happy deploying! 🚀
