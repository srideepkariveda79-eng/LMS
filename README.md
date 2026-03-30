# Arohak LMS

A full-stack Learning Management System built for Arohak Inc.

---
## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS, MongoDB (Mongoose), Redis (ioredis), JWT, Multer |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Admin Panel | React 19, Vite, Tailwind CSS |
| Email | Nodemailer (Gmail SMTP) |

---

## Project Structure

```
arohak-lms/
├── backend-nest/        # NestJS API server
│   ├── src/
│   │   ├── auth/        # Auth module
│   │   ├── booking/     # Enrollment & progress
│   │   ├── course/      # Courses, quiz, ratings
│   │   ├── common/      # Redis & Mailer services
│   │   ├── schemas/     # Mongoose schemas
│   │   └── main.ts
│   └── uploads/         # Course images
├── frontend/            # User-facing React app
│   └── src/
│       ├── components/  # Navbar, AuthModal, Certificate...
│       ├── pages/       # Home, Courses, Profile, MyCourses...
│       ├── context/     # AuthContext
│       └── hooks/       # useWishlist
└── admin/               # Admin React app
    └── src/
        ├── components/  # Dashboard, AddPage, ListPage...
        └── pages/       # Login, Add, List, Edit, Bookings
```

---

## Features

**User**
- Register / Login with email verification
- Forgot & reset password via email
- Browse and enroll in courses (free)
- Video player (YouTube, Google Drive, MP4)
- Chapter-level progress tracking
- Quiz with scoring and pass/fail
- Certificate generation on completion
- Course ratings, wishlist, profile page

**Admin**
- Add / Edit / Delete courses with image upload
- Manage lectures, chapters, video URLs
- Configure quizzes per course
- View all bookings with search
- Dashboard with enrollment stats

**Platform**
- Redis caching on course endpoints (5 min TTL)
- JWT authentication
- Email via Gmail App Password
- Fully responsive design


---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Redis (optional)

### Backend

```bash
cd backend-nest
npm install
npm run start:dev
```

`backend-nest/.env`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key
JWT_EXPIRES=7d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password
REDIS_URL=redis://localhost:6379
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env`:
```env
VITE_API_BASE=http://localhost:4000
```

### Admin Panel

```bash
cd admin
npm install
npm run dev
```

`admin/.env`:
```env
VITE_API_BASE=http://localhost:4000
```

---

## Redis (Windows)

Redis is installed at `C:\Redis`. Start it before running the backend:

```bash
C:\Redis\redis-server.exe --port 6379
```

The app works without Redis — leave `REDIS_URL` empty and caching is skipped gracefully.

---

## Seed Admin User

```bash
cd backend-nest
node seed-admin.js
```

Or manually via MongoDB — insert a user with `role: "admin"` and `emailVerified: true`.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| PATCH | `/api/auth/profile` | Update name |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/auth/verify-email` | Verify email token |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset password |
| POST | `/api/auth/admin/login` | Admin login |

### Courses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/course/public` | Public courses (cached) |
| GET | `/api/course/:id` | Course detail (cached) |
| POST | `/api/course` | Create course (admin) |
| PUT | `/api/course/:id` | Update course (admin) |
| DELETE | `/api/course/:id` | Delete course (admin) |
| POST | `/api/course/:id/rate` | Rate a course |
| GET | `/api/course/:id/quiz` | Get quiz |
| POST | `/api/course/:id/quiz/submit` | Submit quiz |
| GET | `/api/course/quiz/my-results` | User quiz results |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/booking/create` | Enroll in course |
| GET | `/api/booking/my` | User enrollments |
| GET | `/api/booking/check` | Check enrollment |
| POST | `/api/booking/progress` | Save progress |
| GET | `/api/booking/progress` | Get progress |
| GET | `/api/booking` | All bookings (admin) |
| GET | `/api/booking/stats` | Stats (admin) |

---

## Deployment

| Service | Platform |
|---|---|
| Backend | Railway |
| Frontend | Vercel |
| Admin | Vercel |
| Database | MongoDB Atlas |
| Redis | Upstash or Redis Cloud |
| Images | Cloudinary |
| Email | Brevo (Sendinblue) |

### Backend → Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the `backend-nest` folder as the root directory
4. Add these environment variables in Railway dashboard:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES=7d
FRONTEND_URL=https://your-frontend.vercel.app
ADMIN_URL=https://your-admin.vercel.app
CLOUDINARY_CLOUD_NAME=dvnnnqqcg
CLOUDINARY_API_KEY=521253244286213
CLOUDINARY_API_SECRET=IExa4HZUVsEZWioMdLJcaMjaYKE
BREVO_API_KEY=xkeysib-...
REDIS_URL=redis://...
```

Railway auto-detects the build via `nixpacks.toml`:
- Build: `npm install && npm run build`
- Start: `npm run start:prod`

### Frontend & Admin → Vercel

1. Import repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend` (or `admin`)
3. Add env var: `VITE_API_BASE=https://your-railway-backend.up.railway.app`

---

**Built by Arohak Inc.**
