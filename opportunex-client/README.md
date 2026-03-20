# OpportuneX Frontend

React frontend for OpportuneX - Rwanda's premier platform connecting youth with employment opportunities.

## Tech Stack

- **React 18** with Vite
- **React Router v6**
- **Tailwind CSS**
- **React Query (TanStack Query)**
- **React Hook Form + Zod**
- **Axios**
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see `opportunex-server`)

### Installation

1. Install dependencies:

```bash
cd opportunex-client
npm install
```

1. Create `.env` file:

```bash
cp .env.example .env
```

1. Update `.env` with your backend URL:

```env
VITE_API_URL=http://localhost:5000/api
```

1. Start development server:

```bash
npm run dev
```

Visit `http://localhost:5173`

## User Roles

### Youth (Job Seekers)

- Browse jobs and apply
- Take skill verification tests
- Request mentorship
- Track application status
- Manage profile and CV

### Employers

- Post job listings
- Search talent database
- Review applications
- Manage company profile
- Subscribe to premium plans

### Admin

- Manage users
- View analytics
- Verify employers
- Manage skill tests

## Building for Production

```bash
npm run build
```

Output: `dist/` folder

## Deployment

### Vercel

1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Netlify

1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables

## Key Features

- ✅ JWT Authentication
- ✅ Role-based access control
- ✅ Responsive design (mobile-first)
- ✅ Real-time form validation
- ✅ File uploads (CV, avatar, portfolio)
- ✅ Skill verification system
- ✅ Job matching algorithm
- ✅ Application tracking
- ✅ Mentorship platform
- ✅ Payment integration ready

## License

MIT License
