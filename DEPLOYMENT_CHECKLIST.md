# 📋 OpportuneX Deployment Checklist

Use this checklist before deploying to production to ensure everything is configured correctly.

## ✅ Pre-Deployment Checklist

### 1. **Environment Configuration**

#### Backend (.env)

- [ ] `NODE_ENV=production`
- [ ] Valid `MONGO_URI` (MongoDB Atlas recommended)
- [ ] Strong `JWT_SECRET` (min 32 characters, random)
- [ ] `JWT_EXPIRE` set (e.g., 7d)
- [ ] Cloudinary credentials configured
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
- [ ] Email service configured
  - [ ] `EMAIL_HOST`
  - [ ] `EMAIL_PORT`
  - [ ] `EMAIL_USER`
  - [ ] `EMAIL_PASSWORD`
  - [ ] `EMAIL_FROM`
- [ ] `CLIENT_URL` points to production frontend URL
- [ ] Flutterwave credentials (production keys)
  - [ ] `FLUTTERWAVE_PUBLIC_KEY`
  - [ ] `FLUTTERWAVE_SECRET_KEY`
  - [ ] `FLUTTERWAVE_ENCRYPTION_KEY`
- [ ] Admin credentials set
  - [ ] `ADMIN_EMAIL`
  - [ ] `ADMIN_PASSWORD` (strong password)

#### Frontend (.env)

- [ ] `VITE_API_URL` points to production backend
- [ ] `VITE_CLOUDINARY_CLOUD_NAME` configured

### 2. **Database Setup**

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested
- [ ] Backup strategy in place

### 3. **Third-Party Services**

#### Cloudinary

- [ ] Account created
- [ ] Upload presets configured (if needed)
- [ ] Storage quota checked
- [ ] Auto-backup enabled (optional)

#### Email Service

- [ ] SMTP credentials verified
- [ ] Test email sent successfully
- [ ] SPF/DKIM records configured (if custom domain)
- [ ] Rate limits understood

#### Flutterwave

- [ ] Account verified
- [ ] KYC completed
- [ ] Production keys obtained
- [ ] Webhook URL configured
- [ ] Test transaction completed

### 4. **Security**

- [ ] All environment variables stored securely
- [ ] No sensitive data in git repository
- [ ] `.gitignore` properly configured
- [ ] Strong admin password set (changed from default)
- [ ] JWT secret is random and secure
- [ ] HTTPS/SSL enabled for production URLs
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled (default: 100 req/15 min)
- [ ] Helmet.js security headers enabled

### 5. **Code Quality**

- [ ] All tests passing (if implemented)
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Input validation in place
- [ ] No hardcoded credentials
- [ ] Dependencies up to date
- [ ] No critical vulnerabilities (`npm audit`)

### 6. **Build & Testing**

#### Backend

- [ ] `npm install` runs without errors
- [ ] Server starts successfully
- [ ] All API endpoints responding
- [ ] Database connection working
- [ ] File uploads working (with Cloudinary)
- [ ] Email sending functional

#### Frontend

- [ ] `npm install` runs without errors
- [ ] `npm run build` completes successfully
- [ ] Build output size reasonable
- [ ] No build warnings
- [ ] API integration working
- [ ] All pages load correctly
- [ ] Responsive design on mobile/tablet/desktop

### 7. **Deployment Platform Setup**

#### For Docker Deployment

- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] `.env` file created from `.env.example`
- [ ] Ports available (3000, 5000, 27017)
- [ ] `docker-compose.yml` configured

#### For Vercel (Frontend)

- [ ] GitHub repository connected
- [ ] Environment variables added in Vercel dashboard
- [ ] Build settings configured (Root: `opportunex-client`)
- [ ] Domain configured (if custom)

#### For Render/Railway (Backend)

- [ ] Repository connected
- [ ] Environment variables added
- [ ] Build command set: `npm install`
- [ ] Start command set: `npm start`
- [ ] Health check endpoint configured: `/api/health`

### 8. **Post-Deployment**

- [ ] Seed database with initial data: `npm run seed`
- [ ] Admin login tested
- [ ] Sample user registration tested
- [ ] Job posting tested (employer)
- [ ] Job application tested (youth)
- [ ] File upload tested (avatar, CV)
- [ ] Email notifications working
- [ ] Payment flow tested (using test cards)
- [ ] Skill test submission tested
- [ ] Course enrollment tested

### 9. **Monitoring & Logging**

- [ ] Health check endpoint accessible: `GET /api/health`
- [ ] Error logging configured
- [ ] Uptime monitoring setup (UptimeRobot, Pingdom, etc.)
- [ ] Log retention policy defined
- [ ] Backup schedule configured
- [ ] Alert system setup for critical errors

### 10. **Documentation**

- [ ] README.md updated with production URLs
- [ ] DEPLOYMENT.md reviewed
- [ ] API documentation accessible
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

### 11. **Performance**

- [ ] Frontend assets optimized (images, fonts)
- [ ] Gzip compression enabled
- [ ] CDN configured (if using)
- [ ] Database indexes created
- [ ] Caching strategy implemented
- [ ] Load testing performed (optional)

### 12. **Legal & Compliance**

- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] Cookie consent implemented (if applicable)
- [ ] GDPR compliance checked (if applicable)
- [ ] Data retention policy defined

### 13. **Backup & Recovery**

- [ ] Database backup automated (MongoDB Atlas)
- [ ] Backup restoration tested
- [ ] Cloudinary backup configured
- [ ] Environment variables backed up securely
- [ ] Disaster recovery plan documented

### 14. **Final Checks**

- [ ] All features working end-to-end
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari, Edge)
- [ ] SEO meta tags configured
- [ ] Favicon and app icons in place
- [ ] 404 page styled
- [ ] Loading states working
- [ ] Error messages user-friendly

---

## 🚀 Deployment Commands

### Docker Deployment

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Manual Deployment

```bash
# Backend
cd opportunex-server
npm install --production
pm2 start ecosystem.config.js

# Frontend
cd opportunex-client
npm install
npm run build
# Copy dist/ to web server
```

---

## 📊 Health Check URLs

After deployment, verify these endpoints:

- **Backend Health:** `https://your-api-domain.com/api/health`
- **Frontend:** `https://your-frontend-domain.com`
- **Backend Root:** `https://your-api-domain.com`

Expected responses:

```json
// /api/health
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-03-20T10:30:00.000Z",
  "uptime": 3600
}
```

---

## 🆘 Rollback Plan

If deployment fails:

1. **Docker:** `docker-compose down` and restart previous version
2. **Vercel:**  Go to Deployments → Promote previous deployment
3. **Render/Railway:** Redeploy previous commit
4. **Manual:** Restore from backup, restart PM2 with previous code

---

## 📝 Post-Launch Tasks

Within 24 hours:

- [ ] Monitor error logs
- [ ] Check uptime
- [ ] Verify email notifications
- [ ] Test payment flows
- [ ] Monitor performance metrics
- [ ] Collect initial user feedback

Within 1 week:

- [ ] Change default admin password
- [ ] Review security logs
- [ ] Optimize slow queries
- [ ] Fix any reported bugs
- [ ] Update documentation based on issues

---

## 🎉 Launch

When all checks are complete, you're ready to launch OpportuneX to production!

**Remember:**

- Start with a soft launch to a small user group
- Monitor closely for the first 48 hours
- Have a rollback plan ready
- Communicate clearly with early users

Good luck! 🚀🇷🇼
