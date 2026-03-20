# OpportuneX

> **Bridging Rwanda's Employment-Education Gap**

OpportuneX is a full-stack digital platform that connects Rwandan youth (students and recent graduates) with employers through mentorship, skill verification, and intelligent job matching.

## Problem Statement

Rwanda produces over 50,000 university graduates annually, yet faces significant employment challenges. While there are approximately 14,500 entry-level positions available, many graduates struggle to find work that matches their qualifications. OpportuneX bridges this gap through technology.

## Key Features

### For Youth

- ✅ Professional profile management
- ✅ CV and portfolio uploads
- ✅ Job search with smart filters
- ✅ AI-powered job recommendations
- ✅ Skill verification tests with badges
- ✅ Mentorship connections
- ✅ Application tracking

### For Employers

- ✅ Job posting management
- ✅ Talent search with verified skills
- ✅ Application review system
- ✅ Company profile
- ✅ Subscription plans
- ✅ Analytics dashboard

### For Admins

- ✅ User management
- ✅ Platform analytics
- ✅ Employer verification
- ✅ Skill test management
- ✅ Revenue tracking

## Tech Stack

### Frontend

- React 18 with Vite
- React Router v6
- Tailwind CSS
- React Query
- React Hook Form + Zod
- Axios
- Lucide React

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (file storage)
- Nodemailer (emails)
- Bcrypt (password hashing)

## Project Structure

```
OpportuneX/
├── opportunex-server/    # Backend API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── opportunex-client/    # React Frontend
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   └── App.jsx
    └── package.json
```

## Quick Start

### Backend Setup

```bash
cd opportunex-server
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed    # Seed sample data
npm run dev     # Start server on port 5000
```

### Frontend Setup

```bash
cd opportunex-client
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev     # Start dev server on port 5173
```

### Default Login Credentials (After Seeding)

- **Admin**: <admin@opportunex.com> / Admin@123456
- **Youth**: <jean.uwimana@example.com> / password123
- **Employer**: <alice@techcompany.rw> / password123

## Environment Setup

### Backend (.env)

- MongoDB Atlas connection string
- JWT secret key
- Cloudinary credentials
- Email provider credentials
- Flutterwave payment keys

### Frontend (.env)

- Backend API URL
- Cloudinary cloud name

See `.env.example` files in each directory for complete setup.

## Deployment

### Backend

- **Recommended**: Render.com (free tier)
- **Alternative**: Railway, Heroku

### Frontend

- **Recommended**: Vercel (free tier)
- **Alternative**: Netlify

### Database

- **MongoDB Atlas** (free tier, 512MB)

## Key Business Logic

### Job Matching Algorithm

Matches youth to jobs based on:

- Skills overlap
- Sector preferences
- Location match
- University/major relevance

### Skill Verification

1. Youth takes timed test
2. Auto-scored on submission
3. Badge awarded if passed (≥70%)
4. Badge added to profile (visible to employers)
5. Can retake after 7 days

### Subscription Model

- **Free**: 1 job/month, limited talent search
- **Basic** (20,000 RWF/month): 5 jobs, full search
- **Premium** (50,000 RWF/month): Unlimited jobs, analytics

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Jobs

- `GET /api/jobs` - Browse jobs (public)
- `POST /api/jobs` - Create job (employer)
- `GET /api/jobs/recommended` - AI recommendations (youth)

### Applications

- `POST /api/applications` - Apply (youth)
- `GET /api/applications/my-applications` - Track status (youth)
- `PUT /api/applications/:id/status` - Update status (employer)

### Skills

- `GET /api/skills/tests` - Available tests
- `POST /api/skills/tests/:id/submit` - Submit answers
- `GET /api/skills/my-results` - View results

See full API documentation in backend README.

## Design System

### Colors

- **Primary**: #1E3A5F (Deep Blue) - Trust, professionalism
- **Accent**: #F59E0B (Amber) - Energy, opportunity
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)

### Typography

- Font: Plus Jakarta Sans
- Mobile-first responsive design

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## Roadmap

### Phase 1 (MVP) - ✅ Complete

- User authentication and profiles
- Job posting and application system
- Skill verification tests
- Basic mentorship system

### Phase 2 (Upcoming)

- Mobile app (React Native)
- Direct messaging
- Video interviews
- Advanced analytics
- Kinyarwanda language support

### Phase 3 (Future)

- AI-powered resume builder
- Salary insights
- Company reviews
- Referral system

## Partner Universities

- University of Rwanda (UR)
- African Leadership University (ALU)
- Adventist University of Central Africa (AUCA)

## Target Sectors

- Technology
- Finance
- Hospitality
- Engineering
- Business
- Healthcare
- Education

## Support

For issues or questions:

- Email: <info@opportunex.rw>
- GitHub Issues: [Create an issue](https://github.com/yourusername/opportunex/issues)

## License

MIT License - see LICENSE file for details

---

<div align="center">
  <p><strong>Made with ❤️ for Rwanda's Future</strong></p>
  <p>Empowering 50,000+ graduates to find meaningful careers</p>
</div>
