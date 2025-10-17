# Job Scraper - Deployment Guide

## Deploy to Render (Free Hosting)

### Step 1: Prepare for Deployment

1. **Install Git** (if not already installed):
```bash
git --version
```

2. **Initialize Git Repository**:
```bash
cd /home/kumar/Documents/Job
git init
git add .
git commit -m "Initial commit - Job scraper with priority system"
```

3. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name it: `job-scraper`
   - Don't initialize with README
   - Copy the repository URL

4. **Push to GitHub**:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Sign Up**: Go to https://render.com and sign up with GitHub

2. **Create New Web Service**:
   - Click "New +" → "Background Worker"
   - Connect your `job-scraper` repository

3. **Configure**:
   - **Name**: job-scraper
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add these variables from your `.env` file:
     - `EMAIL` = kumarbackupyt@gmail.com
     - `APP_PASSWORD` = rvdaalbgaqdxuuxr
     - `GEMINI_API_KEY` = AIzaSyAe7B4D7_gNCLj1z6bia2Lo6cJasGf6GFM
     - `TARGET_EMAIL` = kumarsssdsk@gmail.com

5. **Deploy**: Click "Create Background Worker"

---

## Alternative: Railway (Also Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `job-scraper` repo
5. Add environment variables (same as above)
6. Railway will auto-deploy

---

## Alternative: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Create new app from GitHub
3. Select your repo
4. Choose "Worker" as app type
5. Add environment variables
6. Deploy (Free tier: $0/month for basic workers)

---

## Alternative: Keep Running on Your PC

### Using PM2 (Process Manager)

1. **Install PM2**:
```bash
npm install -g pm2
```

2. **Start Application**:
```bash
pm2 start server.js --name job-scraper
```

3. **Useful PM2 Commands**:
```bash
pm2 status              # Check status
pm2 logs job-scraper    # View logs
pm2 restart job-scraper # Restart
pm2 stop job-scraper    # Stop
pm2 delete job-scraper  # Remove
```

4. **Auto-start on System Boot**:
```bash
pm2 startup
pm2 save
```

---

## Monitoring & Logs

### On Render/Railway:
- Check the dashboard for logs
- Logs show all job searches and email alerts

### With PM2:
```bash
pm2 logs job-scraper --lines 100
```

---

## Testing Locally

Before deploying, test locally:

```bash
node server.js
```

You should see:
- Priority companies searched first
- Immediate email if jobs found
- Regular companies searched after
- Runs every 24 hours automatically

---

## Important Notes

⚠️ **Security**: Never commit `.env` file to Git (it's already in `.gitignore`)

✅ **Free Tier Limits**:
- Render: 750 hours/month (enough for 24/7)
- Railway: $5 free credit/month
- DigitalOcean: Free basic workers

🔄 **Updates**: After making code changes:
```bash
git add .
git commit -m "Update message"
git push origin main
```
Render/Railway will auto-redeploy!

---

## Troubleshooting

**If emails not sending**:
1. Check Gmail settings: Allow "Less secure app access" or use App Password
2. Verify `.env` variables are set correctly

**If API errors**:
1. Check Gemini API key is valid
2. Monitor rate limits (free tier: 15 requests/minute)

**If deployment fails**:
1. Check logs in Render/Railway dashboard
2. Ensure `package.json` has all dependencies
3. Verify Node.js version compatibility
