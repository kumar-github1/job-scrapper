# 🚀 Deploy to Railway with Resend

## ✅ Resend is Working Locally!

You just tested it successfully. Now let's deploy to Railway!

---

## Step 1: Push Code to GitHub

```bash
cd /home/kumar/Documents/Job

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Use Resend for email delivery (works on Railway)"

# Push to GitHub
git push origin main
```

---

## Step 2: Update Railway Environment Variables

Go to: **https://railway.app/dashboard**

1. Click your `job-scraper` project
2. Click "**Variables**" tab
3. **Delete/Remove these variables** (if they exist):
   - ❌ `APP_PASSWORD`
   - ❌ `EMAIL_SERVICE`
   - ❌ `BREVO_SMTP_KEY`

4. **Add/Update these 4 variables:**

```
RESEND_API_KEY = re_MZ8CG7DY_5Zv654nezNLuTswyi88f3eLe
```

```
TARGET_EMAIL = kumarbackupyt@gmail.com
```

```
GEMINI_API_KEY = AIzaSyAe7B4D7_gNCLj1z6bia2Lo6cJasGf6GFM
```

```
EMAIL = kumarbackupyt@gmail.com
```

5. Railway will **automatically redeploy** when you save!

---

## Step 3: Check Logs

1. In Railway, click "**Deployments**"
2. Click the latest deployment
3. Click "**View Logs**"
4. Wait 1-2 minutes for the job search to start

**Look for:**
```
📧 Using Resend for email delivery (optimized for Railway)
🔥 Priority companies: 1
📋 Regular companies: 400+
⚡ Step 1: Searching priority companies...
✅ Email sent successfully to kumarbackupyt@gmail.com via Resend
```

---

## Step 4: Check Your Email!

Open Gmail: `kumarbackupyt@gmail.com`

You should receive an email with subject:
- **"🔥 PRIORITY ALERT - X New Fresher Software Roles"** (if priority jobs found)
- OR **"📋 Job Alert - X New Fresher Software Roles"** (if regular jobs found)

---

## ✅ Success Checklist:

- [ ] Code pushed to GitHub
- [ ] Railway variables updated (4 variables)
- [ ] Railway deployed successfully
- [ ] Logs show "Using Resend for email delivery"
- [ ] Logs show "Email sent successfully via Resend"
- [ ] Email received in kumarbackupyt@gmail.com

---

## 🎯 What Happens Now:

**Every 24 hours:**
1. 🔥 Searches **1 priority company** (Amazon) first
2. 📋 Then searches **400+ regular companies**
3. ✅ Sends email with all new jobs found
4. 🎯 Only **India/Remote** locations
5. 🎯 Only **fresher software engineering** roles

---

## 📝 Important Notes:

### **Resend Free Tier Limitation:**
- Can only send to **kumarbackupyt@gmail.com** (the email you signed up with)
- 100 emails/day (plenty for this use case - only 1-2 emails per day)

### **To send to a different email (kumarsssdsk@gmail.com):**
You need to verify a custom domain in Resend:
1. Buy a domain ($10/year) like `kumarjobs.com`
2. Verify it in Resend
3. Then you can send from `alerts@kumarjobs.com` to any email

**For now, job alerts go to kumarbackupyt@gmail.com (the same email you'll check anyway!)**

---

## 🎉 You're Done!

Once Railway deploys and you see the success logs, you're all set!

The job scraper will:
- ✅ Run automatically every 24 hours on Railway
- ✅ Search 400+ companies for fresher software jobs
- ✅ Email you via Resend (no timeouts!)
- ✅ Work perfectly on cloud hosting

**Enjoy your automated job alerts!** 🚀
