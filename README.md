# Social Mind

**Social Mind** is a full-stack AI-powered social media management platform that helps creators, brands, and teams plan, schedule, analyze, and automate their social media presence across multiple platforms. It features advanced analytics, AI content generation, multi-platform scheduling, 2FA authentication, and a modern, responsive UI.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Backend](#backend)
  - [Tech Stack](#backend-tech-stack)
  - [Key Features](#backend-key-features)
  - [API Endpoints](#api-endpoints)
  - [Database Models](#database-models)
  - [Environment Setup](#environment-setup)
- [Frontend](#frontend)
  - [Tech Stack](#frontend-tech-stack)
  - [Key Features](#frontend-key-features)
  - [UI Overview](#ui-overview)
- [Setup & Installation](#setup--installation)
- [Security](#security)
- [Contributing](#contributing)
- [Team](#team)

---

## Features
- **AI Content Generation**: Generate engaging captions, hashtags, and posts tailored to your brand voice using Google Gemini API.
- **Intelligent Scheduling**: Optimize posting times based on audience behavior and engagement patterns.
- **Multi-Platform Management**: Manage Instagram, Twitter, Facebook, LinkedIn, YouTube, and Threads from one dashboard.
- **Personalized Recommendations**: AI learns your preferences to suggest content strategies and improvements.
- **Engagement Automation**: Auto-respond to comments and messages with intelligent, contextual replies.
- **Advanced Analytics**: Real-time insights with sentiment analysis and performance predictions.
- **2FA/OTP Authentication**: Secure login with email-based OTP two-factor authentication.
- **Google OAuth**: Sign in with Google for seamless onboarding.
- **Content Calendar**: Visualize and manage your scheduled content in a calendar view.
- **Team Collaboration**: Invite team members, assign roles, and manage permissions.
- **Responsive UI**: Modern, accessible, and theme-aware (dark/light mode) interface.
- **Email Notifications**: Automated reminders, welcome emails, and content scheduling notifications.

---

## Architecture

```
Frontend (React + Vite + Tailwind)
        |
        | REST API
        v
Backend (Node.js + Express + Prisma + PostgreSQL)
        |
        v
   Database (PostgreSQL)
```

---

## Backend

### Backend Tech Stack
- Node.js, Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Google Gemini API (AI)
- Nodemailer (email)
- Multer (file uploads)
- JWT (authentication)

### Backend Key Features
- **User Authentication**: Email/password, Google OAuth, 2FA/OTP
- **User & Organization Management**: Roles, preferences, organizations
- **Social Media Account Integration**: OAuth for YouTube, Threads, etc.
- **Post Scheduling**: Create, update, delete, and fetch scheduled posts
- **AI Endpoints**: Caption generation, content planning via Gemini API
- **Analytics**: Dashboard metrics, post analytics, engagement stats
- **Email Automation**: Welcome, OTP, daily reminders, content scheduling

### API Endpoints (Highlights)
- `POST /auth/signup` — Register new user
- `POST /auth/signin` — Login (triggers OTP)
- `POST /auth/verify-otp` — Verify OTP for 2FA
- `POST /auth/google` — Google OAuth login
- `GET /auth/me` — Get current user
- `PUT /users/profile` — Update user profile
- `POST /posts` — Create scheduled post
- `GET /posts` — List user posts
- `PUT /posts/:id` — Update post
- `DELETE /posts/:id` — Delete post
- `GET /dashboard/analytics` — Get analytics data
- `POST /ai/caption` — AI caption generation
- `POST /ai/content-plan` — AI content planning

### Database Models
- **User**: Roles, status, preferences, OTP fields, tokens
- **Organization**: Name, logo, users
- **UserPreference**: Theme, notifications, layout
- **SocialMediaAccount**: Platform, tokens, profile
- **Post**: Content, platform, status, schedule

See [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) for full schema.

### Environment Setup
- Copy `.env.example` to `.env` in `backend/` and fill in required variables (DB, JWT, Google, Gemini, etc.)
- See [`backend/ENVIRONMENT_SETUP.md`](backend/ENVIRONMENT_SETUP.md) for detailed instructions.

---

## Frontend

### Frontend Tech Stack
- React (TypeScript)
- Vite
- Tailwind CSS
- Radix UI
- Recharts (analytics)
- React Router
- Zod, React Hook Form

### Frontend Key Features
- **Modern UI**: Responsive, accessible, and theme-aware
- **Authentication**: Login, registration, Google OAuth, 2FA/OTP
- **Dashboard**: Analytics, metrics, recent posts, charts
- **Content Planning**: AI-powered content plan generator
- **Content Calendar**: Visual scheduling and management
- **Social Accounts**: Connect/manage social media accounts
- **Settings**: Profile, notifications, preferences, export data
- **Team & Footer**: Team info, contact, LinkedIn, avatars
- **Dark/Light Mode**: Theme toggle and full inversion

### UI Overview
- **Homepage**: Features, testimonials, team, login modal, footer
- **Dashboard**: Metrics, analytics, charts, recent posts, logout
- **Content Planning**: AI content plan, platform selection, add to calendar
- **Analytics**: Charts, sentiment, top posts, platform breakdown
- **Calendar**: Month view, post status, schedule/edit/delete
- **Social Accounts**: OAuth connect/disconnect, status, sync
- **Settings**: Profile, notifications, security, preferences, export/delete
- **Onboarding**: Multi-step setup for new users

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- Google Cloud project (for OAuth & Gemini)

### Backend
```bash
cd backend
cp .env.example .env # Fill in your secrets
npm install
npm run dev # or npm run build && npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev # or npm run build && npm run preview
```

### Database
```bash
cd backend
npx prisma migrate dev # or npx prisma migrate deploy
```

---

## Security
- Passwords hashed with bcrypt
- JWT authentication for all protected routes
- 2FA/OTP for login
- OAuth for Google/YouTube/Threads
- CORS enabled
- Environment variables for all secrets
- Email verification for sensitive actions

---

## Contributing
1. Fork the repo & clone
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push and open a PR

---

## Team
- **Ayaan Agarwal** — [LinkedIn](https://www.linkedin.com/in/ayaan-agarwal-729266261/) — ayaanbansal02@gmail.com
- **Dhruv Duggal** — [LinkedIn](https://www.linkedin.com/in/dhruv-duggal-897b01255/) — dhruvduggal2049@gmail.com
- **Prarabdh Atrey** — [LinkedIn](https://www.linkedin.com/in/prarabdh-atrey-498ab9255/) — prarabdhatrey@gmail.com
- **Shivangi Srivastva** — [LinkedIn](https://www.linkedin.com/in/shivangi-srivastva-90ab73270/) — shivangisrivastva30@gmail.com

Contact: **socialminddd@gmail.com**

---

## License
MIT 