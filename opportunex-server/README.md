# OpportuneX Backend API

Backend API for OpportuneX - Rwanda's premier platform connecting youth with employment opportunities.

## Tech Stack

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cloudinary** for file storage
- **Nodemailer** for emails

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for file uploads

### Installation

1. Install dependencies:

```bash
cd opportunex-server
npm install
```

1. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

1. Update `.env` with your credentials:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_secure_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Frontend URL
CLIENT_URL=http://localhost:5173
```

1. Seed the database (optional):

```bash
npm run seed
```

1. Start the development server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Main Endpoints

#### Auth

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password/:token` - Reset password

#### Jobs

- `GET /jobs` - Get all jobs (with filters)
- `GET /jobs/:id` - Get single job
- `POST /jobs` - Create job (Employer)
- `PUT /jobs/:id` - Update job (Employer)
- `DELETE /jobs/:id` - Delete job (Employer)

#### Applications

- `POST /applications` - Apply to job (Youth)
- `GET /applications/my-applications` - Get youth's applications
- `GET /applications/job/:jobId` - Get applications for a job (Employer)

#### Skills

- `GET /skills/tests` - Get available skill tests
- `POST /skills/tests/:id/submit` - Submit test answers
- `GET /skills/my-results` - Get user's test results

See full API documentation in the `/docs` folder.

## Project Structure

```
opportunex-server/
├── config/          # Database and service configurations
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # Mongoose schemas
├── routes/          # API route definitions
├── utils/           # Helper functions
└── server.js        # App entry point
```

## Deployment

### Render.com (Recommended)

1. Create new Web Service
2. Connect your GitHub repo
3. Set Build Command: `npm install`
4. Set Start Command: `node server.js`
5. Add environment variables from `.env`

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform's dashboard.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
