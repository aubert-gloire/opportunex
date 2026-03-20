# OpportuneX - Quick Start Guide

## ✅ Setup Complete

All issues have been fixed and the application is ready to run.

## What Was Fixed

1. ✅ MongoDB connection string configured
2. ✅ JWT secret key generated
3. ✅ Frontend .env file created
4. ✅ Course routes ordering fixed (specific routes before generic /:id)
5. ✅ Rating component props corrected
6. ✅ Frontend dependencies installed

## Next Steps

### 1. Seed the Database

```bash
cd opportunex-server
npm run seed
```

This will create:

- Admin user
- Sample youth and employer users
- 3 sample jobs
- 3 skill tests
- 4 sample courses

### 2. Start the Backend Server

```bash
cd opportunex-server
npm run dev
```

Server will run on: <http://localhost:5000>

### 3. Start the Frontend (in a new terminal)

```bash
cd opportunex-client
npm run dev
```

Frontend will run on: <http://localhost:5173>

### 4. Login Credentials

After seeding:

- **Admin**: <admin@opportunex.com> / Admin@123456
- **Youth**: <jean.uwimana@example.com> / password123
- **Employer**: <alice@techcompany.rw> / password123

## Features Available

### Youth Users

- Browse and search jobs
- Apply to jobs and track applications
- Take skill tests and earn badges
- **Browse courses and enroll**
- **Watch video lessons**
- **Track course progress**
- **Earn course certificates**
- Connect with mentors
- Build profile with CV upload

### Employers

- Post job listings
- Review applications
- Search for talent
- Manage subscriptions

### Admin

- User management
- Analytics dashboard
- Create skill tests
- **Create and manage courses**

## Optional: Configure Additional Services

### Cloudinary (for file uploads)

1. Sign up at <https://cloudinary.com>
2. Get your credentials
3. Update .env:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Email (for notifications)

1. Use Gmail with App Password
2. Update .env:

```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

## Troubleshooting

### Port Already in Use

```bash
# Change PORT in .env to 5001 or another available port
```

### MongoDB Connection Error

- Verify your IP is whitelisted in MongoDB Atlas
- Check connection string is correct

### Frontend API Error

- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend .env

## 🎉 You're Ready

Visit <http://localhost:5173> and start exploring OpportuneX!
