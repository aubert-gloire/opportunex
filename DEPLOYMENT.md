# 🚀 OpportuneX Deployment Guide

Complete guide for deploying the OpportuneX platform to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
  - [Option 1: Docker Deployment](#option-1-docker-deployment)
  - [Option 2: Cloud Platforms](#option-2-cloud-platforms)
  - [Option 3: Manual Deployment](#option-3-manual-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

### Required Services

1. ✅ **MongoDB Database**
   - MongoDB Atlas (Recommended - Free tier available)
   - Or self-hosted MongoDB instance
   - Connection string ready

2. ✅ **Cloudinary Account**
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get Cloud Name, API Key, and API Secret

3. ✅ **Email Service**
   - Gmail with App Password
   - Or SendGrid, AWS SES, etc.

4. ✅ **Flutterwave Account** (Payment Gateway)
   - Sign up at [flutterwave.com](https://flutterwave.com)
   - Get Public Key, Secret Key, and Encryption Key

5. ✅ **Domain Name** (Optional but recommended)
   - For production deployment

---

## 🌍 Environment Setup

### 1. Backend Environment Variables

Create `opportunex-server/.env`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/opportunex?retryWrites=true&w=majority

# JWT Security
JWT_SECRET=your_256_bit_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=noreply@opportunex.com

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com

# Flutterwave
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxx
FLUTTERWAVE_ENCRYPTION_KEY=FLWSECK_TESTxxxxx

# Admin Credentials
ADMIN_EMAIL=admin@opportunex.com
ADMIN_PASSWORD=Change_This_Strong_Password_123!
```

### 2. Frontend Environment Variables

Create `opportunex-client/.env`:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🐳 Option 1: Docker Deployment

### Quick Start with Docker Compose

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/opportunex.git
   cd opportunex
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Build and start containers**

   ```bash
   docker-compose up -d
   ```

4. **Check status**

   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

5. **Access the application**
   - Frontend: <http://localhost:3000>
   - Backend: <http://localhost:5000>
   - MongoDB: localhost:27017

### Production Docker Deployment

For production with external MongoDB:

```bash
# Build images
docker build -t opportunex-backend ./opportunex-server
docker build -t opportunex-frontend ./opportunex-client

# Run backend
docker run -d \
  --name opportunex-backend \
  -p 5000:5000 \
  --env-file opportunex-server/.env \
  opportunex-backend

# Run frontend
docker run -d \
  --name opportunex-frontend \
  -p 80:80 \
  opportunex-frontend
```

---

## ☁️ Option 2: Cloud Platforms

### A. Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/opportunex.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Set root directory: `opportunex-client`
   - Add environment variables:

     ```
     VITE_API_URL=https://your-backend.onrender.com/api
     VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
     ```

   - Deploy!

#### Backend on Render

1. **Create new Web Service** at [render.com](https://render.com)
2. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `opportunex-server`
3. **Add Environment Variables** (from your .env file)
4. **Deploy**

#### Configure MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your IP to whitelist (or use 0.0.0.0/0 for all IPs)
4. Get connection string
5. Update `MONGO_URI` in Render environment variables

---

### B. Railway (Full Stack)

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy Backend**

   ```bash
   cd opportunex-server
   railway init
   railway up
   railway variables set MONGO_URI=your_mongodb_uri
   # Add all other environment variables
   ```

3. **Deploy Frontend**

   ```bash
   cd ../opportunex-client
   railway init
   railway up
   railway variables set VITE_API_URL=https://your-backend.railway.app/api
   ```

---

### C. AWS (Advanced)

#### Backend on AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd opportunex-server
eb init -p node.js opportunex-backend

# Create environment
eb create opportunex-backend-prod

# Set environment variables
eb setenv NODE_ENV=production MONGO_URI=your_uri JWT_SECRET=your_secret

# Deploy
eb deploy
```

#### Frontend on AWS S3 + CloudFront

```bash
# Build frontend
cd opportunex-client
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔧 Option 3: Manual Deployment (VPS)

For Ubuntu/Debian servers:

### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB (if hosting locally)
# Follow: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### 2. Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/opportunex.git
cd opportunex/opportunex-server

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
# Paste your environment variables

# Start with PM2
pm2 start server.js --name opportunex-backend
pm2 save
pm2 startup
```

### 3. Deploy Frontend

```bash
cd ../opportunex-client

# Install dependencies and build
npm ci
npm run build

# Copy to nginx directory
sudo cp -r dist/* /var/www/opportunex/
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/opportunex`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.opportunex.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name opportunex.com www.opportunex.com;
    root /var/www/opportunex;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/opportunex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d opportunex.com -d www.opportunex.com -d api.opportunex.com
```

---

## 🎯 Post-Deployment

### 1. Database Seeding

```bash
# SSH into backend server or run locally
cd opportunex-server
npm run seed
```

This creates:

- Admin user
- Sample jobs
- Sample skill tests
- Sample courses

### 2. Test the Application

1. **Access frontend:** <https://your-domain.com>
2. **Register test account**
3. **Test authentication**
4. **Test job posting/application**
5. **Test file uploads**
6. **Test skill tests**
7. **Test payment flow** (use Flutterwave test cards)

### 3. Admin Login

- Email: (from ADMIN_EMAIL env variable)
- Password: (from ADMIN_PASSWORD env variable)
- **IMPORTANT:** Change this immediately after first login!

---

## 📊 Monitoring & Maintenance

### Health Checks

Backend exposes a health endpoint:

```
GET /api/health
```

### Logging

#### PM2 Logs

```bash
pm2 logs opportunex-backend
pm2 logs opportunex-backend --lines 100
```

#### Docker Logs

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Database Backups

#### MongoDB Atlas

- Automatic backups enabled by default
- Configure backup schedule in Atlas dashboard

#### Self-Hosted MongoDB

```bash
# Create backup
mongodump --uri="your_mongo_uri" --out=/backup/$(date +%Y%m%d)

# Restore backup
mongorestore --uri="your_mongo_uri" /backup/20240320
```

### Updates & Maintenance

```bash
# Pull latest code
git pull origin main

# Backend update
cd opportunex-server
npm install
pm2 restart opportunex-backend

# Frontend update
cd ../opportunex-client
npm install
npm run build
sudo cp -r dist/* /var/www/opportunex/
```

---

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor error logs
- [ ] Configure backup strategy

---

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB connection: `MONGO_URI` correct?
- Check environment variables are set
- Check logs: `pm2 logs` or `docker-compose logs backend`
- Verify port 5000 is available

### Frontend can't connect to backend

- Check `VITE_API_URL` environment variable
- Check CORS settings in backend
- Check backend is running and accessible
- Check network/firewall rules

### File uploads failing

- Verify Cloudinary credentials
- Check file size limits (default: 10MB)
- Check Cloudinary storage quota

### Database connection issues

- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Check database user permissions
- Test connection with MongoDB Compass

---

## 📞 Support

For deployment issues:

- GitHub Issues: <https://github.com/yourusername/opportunex/issues>
- Email: <support@opportunex.com>
- Documentation: <https://docs.opportunex.com>

---

## 🎉 Success

Your OpportuneX platform should now be live! 🚀

Access your application and start connecting Rwanda's youth with employment opportunities!

**Next Steps:**

1. Set up monitoring (e.g., UptimeRobot, Sentry)
2. Configure analytics (Google Analytics, Mixpanel)
3. Set up email notifications
4. Configure payment webhooks
5. Plan marketing launch

Good luck with your deployment! 🇷🇼✨
