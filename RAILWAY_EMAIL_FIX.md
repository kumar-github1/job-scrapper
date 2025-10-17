# 🚨 Railway Email Timeout - Complete Fix Guide

## The Problem

Your email works **locally** but times out on **Railway** because:
- Gmail blocks connections from Railway's cloud IP addresses
- Even with App Passwords, Gmail may still block cloud hosting providers

## ✅ **SOLUTION 1: Use Brevo (Formerly Sendinblue)** - RECOMMENDED

Brevo is free, reliable, and works perfectly on Railway.

### Step 1: Create Brevo Account (2 minutes)

1. Go to: **https://www.brevo.com/** (formerly Sendinblue)
2. Click "Sign Up Free"
3. Enter your email and create password
4. Verify your email

### Step 2: Get SMTP Credentials

1. After logging in, click your name (top right)
2. Click "SMTP & API"
3. You'll see:
   - **SMTP Server**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **Login**: Your email address
   - **SMTP Key**: Click "Generate a new SMTP key"
   - Copy the SMTP key (looks like: `xkeysib-xxx...`)

### Step 3: Update Railway Environment Variables

Go to Railway Dashboard → Your Project → Variables:

**CHANGE THESE:**
```
EMAIL_SERVICE=brevo
BREVO_SMTP_KEY=your_smtp_key_here
EMAIL=your_email@gmail.com
TARGET_EMAIL=kumarsssdsk@gmail.com
```

**REMOVE THESE (not needed for Brevo):**
```
APP_PASSWORD (delete this)
```

### Step 4: Update server.js

Replace the email transporter section (lines 16-31) with:

```javascript
// Email transporter - Works on Railway with Brevo
const transporterConfig = process.env.EMAIL_SERVICE === 'brevo' ? {
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.BREVO_SMTP_KEY
    }
} : {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
};

const transporter = nodemailer.createTransport(transporterConfig);
```

### Step 5: Deploy

```bash
git add .
git commit -m "Use Brevo for Railway email"
git push origin main
```

Railway will auto-redeploy and emails will work! ✅

---

## ✅ **SOLUTION 2: Try Gmail with Port 465** - Alternative

Sometimes Gmail works on Railway with port 465 instead of 587.

### Update server.js transporter to:

```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD
    },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    socketTimeout: 60000
});
```

Then redeploy to Railway.

---

## ✅ **SOLUTION 3: Use SendGrid** - If Brevo Doesn't Work

SendGrid free tier: 100 emails/day

### Step 1: Create SendGrid Account
1. Go to: https://sendgrid.com/free/
2. Sign up (free tier)
3. Verify your email

### Step 2: Create API Key
1. Click "Settings" → "API Keys"
2. Click "Create API Key"
3. Name it: "job-scraper"
4. Select "Full Access"
5. Copy the API key (starts with `SG.`)

### Step 3: Install SendGrid Package

Add to `package.json` dependencies:
```json
"@sendgrid/mail": "^7.7.0"
```

### Step 4: Update server.js

Replace email sending code with SendGrid:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(jobs, isPriority = false) {
    const prefix = isPriority ? '🔥 PRIORITY ALERT' : '📋 Job Alert';

    const msg = {
        to: process.env.TARGET_EMAIL,
        from: process.env.EMAIL,
        subject: `[${prefix}] ${jobs.length} New Fresher Software Roles`,
        html: formatEmailHTML(jobs)
    };

    try {
        await sgMail.send(msg);
        console.log(`✅ Email sent successfully via SendGrid\n`);
    } catch (error) {
        console.log(`❌ Error sending email: ${error.message}\n`);
    }
}
```

### Step 5: Railway Environment Variables
```
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL=kumarbackupyt@gmail.com
TARGET_EMAIL=kumarsssdsk@gmail.com
```

---

## 🎯 **Which Solution to Use?**

| Solution | Free Tier | Setup Time | Reliability on Railway |
|----------|-----------|------------|----------------------|
| **Brevo** | 300/day | 5 min | ⭐⭐⭐⭐⭐ Best |
| Gmail Port 465 | Unlimited | 2 min | ⭐⭐⭐ Hit or miss |
| SendGrid | 100/day | 5 min | ⭐⭐⭐⭐⭐ Excellent |

**Recommendation**: Use **Brevo** (easiest + most reliable for Railway)

---

## 🧪 Test Locally First

After updating `server.js`, test locally:

```bash
# Set environment variable
export EMAIL_SERVICE=brevo
export BREVO_SMTP_KEY=your_key_here

# Run test
node test-email.js
```

If it works locally, it will work on Railway! ✅

---

## 📊 Check Railway Logs

After deploying:
1. Go to Railway dashboard
2. Click your project → Deployments
3. Click "View Logs"
4. Look for:
   - `✅ Email sent successfully` (working!)
   - `❌ Email attempt failed` (needs fixing)

---

## 💡 Why Gmail Fails on Railway

Gmail uses IP-based blocking:
- Your home IP ✅ Trusted
- Railway's cloud IPs ❌ Blocked (anti-spam)

Even App Passwords may not work because Gmail sees:
- "Login from unfamiliar IP address"
- "Connection from cloud hosting provider"
- Triggers security block

**Solution**: Use an email service designed for cloud hosting (Brevo/SendGrid)

---

## Need Help?

If still having issues, share the exact error from Railway logs and I'll help debug!
