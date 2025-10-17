# 🚀 Quick Fix for Railway Email Timeout

## The Problem
Your job scraper is working on Railway BUT emails are timing out because Gmail blocks cloud hosting IPs.

## ✅ The Solution (Takes 5 minutes)

### Step 1: Generate Gmail App Password

1. Go to: **https://myaccount.google.com/security**
   - Turn on "2-Step Verification" (if not already on)
   - Complete the setup

2. Go to: **https://myaccount.google.com/apppasswords**
   - Select "Mail"
   - Select your device
   - Click "Generate"
   - You'll get a 16-character password like: `abcd efgh ijkl mnop`
   - **COPY THIS** (you won't see it again)

### Step 2: Update Railway

1. Go to: **https://railway.app/dashboard**
2. Click on your `job-scraper` project
3. Click "Variables" tab
4. Find `APP_PASSWORD` and click edit
5. Paste the 16-character App Password (remove spaces: `abcdefghijklmnop`)
6. Click "Save"

### Step 3: Redeploy

Railway will automatically redeploy with the new password.

### Step 4: Check Logs

1. Click "Deployments" → Latest deployment
2. Click "View Logs"
3. Wait 2-3 minutes for job search to start
4. Look for: `✅ Email sent successfully`

---

## What Changed in the Code

I already fixed the code with:

1. **Extended timeouts**: 60 seconds instead of default
2. **Retry logic**: 3 attempts with increasing delays
3. **Better SMTP configuration**: Explicit host/port settings for cloud hosting
4. **Detailed error logging**: See exactly what's failing

These changes are in [server.js](server.js):
- Lines 17-31: Updated email transporter configuration
- Lines 360-393: Email retry logic

---

## Testing Locally

To verify your App Password works before deploying:

```bash
cd /home/kumar/Documents/Job

node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'kumarbackupyt@gmail.com',
    pass: 'PUT_YOUR_16_CHAR_APP_PASSWORD_HERE'
  }
});
transporter.sendMail({
  from: 'kumarbackupyt@gmail.com',
  to: 'kumarsssdsk@gmail.com',
  subject: 'Test Email',
  text: 'If you get this, email is working!'
}).then(() => console.log('✅ SUCCESS')).catch(e => console.log('❌ FAILED:', e.message));
"
```

If this works, your App Password is correct and Railway will work too!

---

## How It Works Now

Once deployed with the App Password:

1. **Every 24 hours** the scraper runs
2. **Priority companies** (Amazon, Google, Microsoft, etc.) searched first
3. **Immediate email** sent if priority jobs found (with subject: 🔥 PRIORITY ALERT)
4. **Regular companies** searched next
5. **Second email** sent if regular jobs found (with subject: 📋 Job Alert)
6. **Retry logic** ensures emails get through even with network hiccups

---

## Summary

**Before**: ❌ Timeout errors, no emails
**After**: ✅ Reliable email delivery with retries

**Time to fix**: 5 minutes
**Cost**: FREE (using Gmail App Passwords)

Just update the `APP_PASSWORD` in Railway and you're good to go! 🎉
