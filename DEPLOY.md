# Deployment Guide

Deploy SeniorAssist to production for your hackathon demo or real users.

---

## 🚀 Quick Deploy (Free Tier)

### Frontend → Vercel (Free)

1. **Push to GitHub** (already done ✅)

2. **Deploy to Vercel:**
   ```bash
   cd frontend
   npx vercel
   ```
   
   Or via Vercel Dashboard:
   - Go to: https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Root Directory: `frontend`
   - Framework Preset: Next.js
   - Deploy!

3. **Environment Variables** (Vercel Dashboard):
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_PHONE_NUMBER=+1234567890
   ```

### Backend → Render (Free)

1. **Deploy to Render:**
   - Go to: https://render.com
   - Click "New" → "Web Service"
   - Connect GitHub repo
   - Settings:
     - Name: `senior-assist-backend`
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **Environment Variables** (Render Dashboard):
   ```
   TWILIO_ACCOUNT_SID=ACxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   OPENAI_API_KEY=sk-xxx
   ELEVENLABS_API_KEY=xxx
   PORT=3001
   FRONTEND_URL=https://your-frontend.vercel.app
   DB_PATH=/var/data/senior-assist.db
   ```

3. **Add Disk for Database:**
   - In Render dashboard → "Disks"
   - Mount Path: `/var/data`
   - Size: 1GB (free)

4. **Update Twilio Webhook:**
   - Go to Twilio Console
   - Update webhook URL to: `https://your-backend.onrender.com/voice/incoming`

---

## 🐳 Docker Deployment (Alternative)

### Build Images

```bash
# Backend
cd backend
docker build -t senior-assist-backend .

# Frontend
cd ../frontend
docker build -t senior-assist-frontend .
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    image: senior-assist-backend
    ports:
      - "3001:3001"
    environment:
      - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
      - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
      - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
    volumes:
      - ./data:/app/data
  
  frontend:
    image: senior-assist-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
```

Run: `docker-compose up -d`

---

## 📱 Twilio Production Setup

### 1. Upgrade Twilio Account
- Free trial → Pay-as-you-go
- Add credit ($20+ recommended)

### 2. Configure Phone Number
- Voice Capabilities: Enabled
- SMS Capabilities: Enabled (for future features)
- Webhook: `https://your-backend-url/voice/incoming`

### 3. Test Call Flow
1. Call from registered number
2. Verify greeting works
3. Test food ordering flow
4. Check order appears in database

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Change all default credentials
- [ ] Enable HTTPS (Vercel/Render do this automatically)
- [ ] Add rate limiting to backend API
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for your frontend domain
- [ ] Add authentication for admin features
- [ ] Set up error tracking (Sentry)
- [ ] Add logging (Logtail, Papertrail)

### Backend CORS Update:

```javascript
// backend/server.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## 📊 Monitoring

### Free Tools:

**Uptime Monitoring:**
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com

**Error Tracking:**
- Sentry: https://sentry.io
- Rollbar: https://rollbar.com

**Logs:**
- Render built-in logs
- Logtail: https://logtail.com

**Analytics:**
- Vercel Analytics (built-in)
- Google Analytics
- Plausible (privacy-friendly)

---

## 🚀 Performance Optimization

### Frontend:
- Enable Vercel caching
- Compress images
- Use Next.js Image component
- Lazy load heavy components

### Backend:
- Use connection pooling for database
- Add Redis for session caching
- Enable gzip compression
- Use CDN for static assets

### Database:
- For production, migrate from SQLite to PostgreSQL
- Add indexes on frequently queried fields
- Set up automated backups

---

## 💰 Cost Estimate (Monthly)

**Free Tier (Good for Hackathon/Demo):**
- Vercel: $0 (up to 100GB bandwidth)
- Render: $0 (750 hours/month)
- Twilio: ~$1/month (1 phone number)
- Total: ~$1/month

**Production (100 users, ~500 calls/month):**
- Vercel Pro: $20/month (better performance)
- Render Standard: $7/month (persistent disk)
- Twilio: $6/month ($1 number + $5 usage)
- Database (PostgreSQL): $7/month
- Total: ~$40/month

**Scaling (1000 users, ~5000 calls/month):**
- Vercel Pro: $20/month
- Render Pro: $25/month
- Twilio: $51/month ($1 number + ~$50 usage)
- Database: $15/month
- Total: ~$110/month

---

## 🎯 Hackathon Demo Setup

**For a killer demo:**

1. **Deploy everything** (takes 30 minutes)
2. **Seed demo data:**
   ```bash
   cd backend
   node seedData.js
   ```
3. **Test the flow** with demo numbers
4. **Record a demo video:**
   - Show the web portal
   - Make a test call (screen record + phone)
   - Show dashboard with order history
5. **Prepare backup:**
   - Local version running (in case WiFi fails)
   - Pre-recorded demo video

---

## 🐛 Troubleshooting

### "502 Bad Gateway" on Render
- Check backend logs
- Verify environment variables are set
- Make sure disk is mounted for database

### Twilio webhook failing
- Check webhook URL is correct
- Verify HTTPS (not HTTP)
- Check backend logs for errors
- Use Twilio debugger

### Frontend can't reach backend
- Check NEXT_PUBLIC_API_URL is set correctly
- Verify CORS settings
- Check backend is actually running

### Database errors
- Check disk is mounted on Render
- Verify DB_PATH environment variable
- Check file permissions

---

## 📞 Support

**Deployment Issues?**
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Twilio Docs: https://www.twilio.com/docs

**Still stuck?**
- Check GitHub Issues
- Open a discussion in the repo

---

Good luck with deployment! 🚀
