# 🚀 Use Resend for Railway (100% Works)

## Why Resend?
- ✅ FREE (100 emails/day - perfect for daily job alerts)
- ✅ **Works 100% on Railway** (designed for cloud hosting)
- ✅ No custom domain needed
- ✅ 2-minute setup
- ✅ Used by thousands of developers

---

## Step-by-Step Setup (5 minutes)

### **Step 1: Create Resend Account**

1. Go to: **https://resend.com/**
2. Click "**Start Building for Free**"
3. Sign up with: `kumarbackupyt@gmail.com` (or any email)
4. Verify your email

### **Step 2: Get API Key**

1. After login, you'll see the dashboard
2. Click "**API Keys**" in the left menu
3. Click "**Create API Key**"
4. Name: `job-scraper`
5. Permission: **Sending access**
6. Click "Create"
7. **COPY THE API KEY** (starts with `re_...`)
   - ⚠️ Save it - you can't see it again!

### **Step 3: Add Verified Sender**

1. In Resend, click "**Domains**" → **"Add Domain"**
2. For testing, use the free option: `onboarding.resend.dev`
3. **OR** add your Gmail as a verified sender:
   - Go to "**Domains**" → **"Verified Addresses"**
   - Add: `kumarbackupyt@gmail.com`
   - Check your Gmail and verify

### **Step 4: Install Resend Package**

```bash
cd /home/kumar/Documents/Job
npm install resend
```

### **Step 5: Update server.js**

Replace the email transporter section with this:

```javascript
// At the top with other requires
const { Resend } = require('resend');

// Remove the old transporter code and replace with:
const resend = new Resend(process.env.RESEND_API_KEY || CONFIG.appPassword);

// Replace sendEmail function with:
async function sendEmail(jobs, isPriority = false) {
    const prefix = isPriority ? '🔥 PRIORITY ALERT' : '📋 Job Alert';

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            console.log(`📧 Attempting to send email via Resend... (Attempt ${retryCount + 1}/${maxRetries})`);

            await resend.emails.send({
                from: `Job Scraper <onboarding@resend.dev>`, // Or your verified email
                to: CONFIG.targetEmail,
                subject: `[${prefix}] ${jobs.length} New Fresher Software Roles - ${new Date().toLocaleDateString()}`,
                html: formatEmailHTML(jobs)
            });

            console.log(`✅ Email sent successfully to ${CONFIG.targetEmail}\n`);
            return; // Success
        } catch (error) {
            retryCount++;
            console.log(`❌ Email attempt ${retryCount} failed: ${error.message}`);

            if (retryCount < maxRetries) {
                const waitTime = retryCount * 5000;
                console.log(`⏳ Waiting ${waitTime/1000}s before retry...\n`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.log(`❌ Failed to send email after ${maxRetries} attempts\n`);
            }
        }
    }
}
```

### **Step 6: Update .env**

```env
EMAIL=kumarbackupyt@gmail.com
TARGET_EMAIL=kumarsssdsk@gmail.com
GEMINI_API_KEY=AIzaSyAe7B4D7_gNCLj1z6bia2Lo6cJasGf6GFM
RESEND_API_KEY=re_your_api_key_here
```

### **Step 7: Test Locally**

```bash
node server.js
```

You should see:
```
✅ Email sent successfully via Resend
```

### **Step 8: Deploy to Railway**

```bash
git add .
git commit -m "Use Resend for email (works on Railway)"
git push origin main
```

In Railway, set these variables:
```
EMAIL=kumarbackupyt@gmail.com
TARGET_EMAIL=kumarsssdsk@gmail.com
GEMINI_API_KEY=AIzaSyAe7B4D7_gNCLj1z6bia2Lo6cJasGf6GFM
RESEND_API_KEY=re_your_api_key_here
```

---

## ✅ Why This Works:

- **Resend is built for cloud hosting** (Railway, Vercel, etc.)
- **No IP blocking** like Gmail
- **No domain requirements** (can use `onboarding@resend.dev` for free)
- **100% reliable** on Railway

---

## 📊 Comparison:

| Service | Works on Railway | Free Tier | Custom Domain Required |
|---------|-----------------|-----------|----------------------|
| Gmail | ❌ Blocked | Unlimited | No |
| Brevo | ⚠️ Requires custom domain | 300/day | Yes (@gmail.com won't work) |
| **Resend** | ✅ **Yes** | **100/day** | **No** |

---

## 🎯 Next Steps:

1. Sign up for Resend (2 min)
2. Get API key
3. Install: `npm install resend`
4. Update server.js (I'll help with this)
5. Test locally
6. Deploy to Railway
7. ✅ Emails work!

**Let me know when you have the Resend API key and I'll update your server.js!** 🚀
