# Social Mind

**Social Mind** is a comprehensive, AI-powered social media management platform designed for creators, brands, agencies, and teams who want to streamline their social media presence across multiple platforms. Built with modern technologies and cutting-edge AI integration, Social Mind combines intelligent content generation, advanced analytics, automated scheduling, and team collaboration features into a single, powerful dashboard.

## What Social Mind Does

Social Mind transforms how you manage social media by providing:

- **🤖 AI-Powered Content Creation**: Generate engaging captions, hashtags, and content ideas using Google's Gemini AI, tailored to your brand voice and platform-specific requirements
- **📅 Intelligent Scheduling**: Automatically optimize posting times based on audience engagement patterns and platform-specific best practices
- **📊 Advanced Analytics**: Track performance across all platforms with real-time insights, sentiment analysis, and predictive analytics
- **🔄 Multi-Platform Management**: Seamlessly manage Instagram, Twitter, Facebook, LinkedIn, YouTube, and Threads from one unified interface
- **🔐 Enterprise Security**: Two-factor authentication, role-based access control, and secure OAuth integrations
- **👥 Team Collaboration**: Invite team members, assign roles, and manage permissions for scalable team workflows
- **📧 Smart Notifications**: Automated email reminders, content scheduling confirmations, and performance reports
- **🎨 Modern UI/UX**: Responsive, accessible design with dark/light theme support and intuitive navigation

Whether you're a solo creator looking to grow your audience, a brand manager coordinating multiple campaigns, or an agency managing client accounts, Social Mind provides the tools and insights you need to succeed in today's competitive social media landscape.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [System Components](#system-components)
- [Data Flow](#data-flow)
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

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Web Browser (React SPA)  │  Mobile App (Future)  │  API Client │
│  • User Interface         │  • Native Mobile      │  • Third-party│
│  • State Management       │  • Push Notifications │  • Integrations│
│  • Theme Management       │  • Offline Support    │  • Webhooks   │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                              │
│  • Request Routing        │  • Authentication    │  • Rate Limiting│
│  • CORS Handling          │  • Input Validation  │  • Error Handling│
│  • File Uploads           │  • Logging           │  • Security Headers│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Internal Communication
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Authentication Service   │  Content Service     │  Analytics Service│
│  • User Registration      │  • Post Management   │  • Metrics Collection│
│  • OAuth Integration      │  • AI Content Gen    │  • Performance Tracking│
│  • 2FA/OTP Handling       │  • Scheduling Logic  │  • Sentiment Analysis│
│                           │                      │                │
│  Email Service            │  Social Media Service│  Notification Service│
│  • Welcome Emails         │  • Platform OAuth    │  • Real-time Alerts│
│  • OTP Delivery           │  • Account Sync      │  • Scheduled Reminders│
│  • Daily Reminders        │  • Content Publishing│  • Performance Reports│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Database Operations
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                      │
│  • Database Abstraction   │  • Migration Management│  • Query Optimization│
│  • Type Safety            │  • Schema Validation  │  • Connection Pooling│
│                           │                      │                │
│  PostgreSQL Database                                            │
│  • User Data              │  • Content Data       │  • Analytics Data   │
│  • Social Accounts        │  • Scheduling Data    │  • Audit Logs       │
│  • Organizations          │  • AI Generated Data  │  • Performance Metrics│
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ External API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                     │
├─────────────────────────────────────────────────────────────────┤
│  Google Services          │  Social Media APIs    │  AI Services        │
│  • OAuth 2.0             │  • Instagram Graph API│  • Google Gemini API│
│  • YouTube Data API      │  • Twitter API v2     │  • Content Generation│
│  • Gmail API             │  • Facebook Graph API │  • Sentiment Analysis│
│  • Google Cloud          │  • LinkedIn API       │  • Trend Analysis    │
│                           │  • Threads API       │  • Optimization      │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│  App.tsx (Root Component)                                       │
│  ├── ThemeProvider (Dark/Light Mode)                           │
│  ├── UserProvider (Authentication State)                       │
│  ├── Router (React Router v6)                                  │
│  │   ├── Public Routes                                         │
│  │   │   ├── Homepage (Landing Page)                           │
│  │   │   ├── Login Modal (Authentication)                      │
│  │   │   └── 404 (Not Found)                                   │
│  │   └── Protected Routes                                      │
│  │       ├── Layout (Sidebar + Header)                         │
│  │       ├── Dashboard (Analytics + Overview)                  │
│  │       ├── Content Planning (AI Content Generation)          │
│  │       ├── Calendar (Visual Scheduling)                      │
│  │       ├── Social Accounts (Platform Management)             │
│  │       ├── Analytics (Detailed Reports)                      │
│  │       ├── Settings (User Preferences)                       │
│  │       └── Onboarding (New User Setup)                       │
│  └── Toast Provider (Notifications)                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Application (src/index.ts)                         │
│  ├── Middleware Stack                                           │
│  │   ├── CORS (Cross-Origin Resource Sharing)                  │
│  │   ├── JSON Parser (Request Body Parsing)                    │
│  │   ├── Multer (File Upload Handling)                         │
│  │   └── Authentication (JWT Token Validation)                 │
│  │                                                              │
│  ├── Authentication Routes                                      │
│  │   ├── POST /auth/signup (User Registration)                 │
│  │   ├── POST /auth/signin (Login + OTP Trigger)               │
│  │   ├── POST /auth/verify-otp (2FA Verification)              │
│  │   ├── POST /auth/google (Google OAuth)                      │
│  │   └── GET /auth/me (Current User)                           │
│  │                                                              │
│  ├── User Management Routes                                     │
│  │   ├── GET /users/profile (Get Profile)                      │
│  │   ├── PUT /users/profile (Update Profile)                   │
│  │   └── DELETE /users (Account Deletion)                      │
│  │                                                              │
│  ├── Content Management Routes                                  │
│  │   ├── POST /posts (Create Post)                             │
│  │   ├── GET /posts (List Posts)                               │
│  │   ├── PUT /posts/:id (Update Post)                          │
│  │   └── DELETE /posts/:id (Delete Post)                       │
│  │                                                              │
│  ├── Analytics Routes                                           │
│  │   ├── GET /dashboard/analytics (Dashboard Metrics)          │
│  │   ├── GET /dashboard/insights (AI Insights)                 │
│  │   └── GET /dashboard/accounts (Social Accounts)             │
│  │                                                              │
│  ├── AI Integration Routes                                      │
│  │   ├── POST /ai/caption (Caption Generation)                 │
│  │   └── POST /ai/content-plan (Content Planning)              │
│  │                                                              │
│  ├── Social Media Integration Routes                            │
│  │   ├── GET /auth/youtube (YouTube OAuth)                     │
│  │   ├── GET /auth/youtube/callback (OAuth Callback)           │
│  │   ├── GET /auth/threads (Threads OAuth)                     │
│  │   └── GET /auth/threads/callback (OAuth Callback)           │
│  │                                                              │
│  └── Utility Routes                                             │
│      ├── GET /health (Health Check)                            │
│      └── POST /test-email (Email Testing)                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Components

### 1. Authentication System
- **Multi-factor Authentication**: Email/password + OTP verification
- **OAuth Integration**: Google, YouTube, Threads, and other social platforms
- **JWT Token Management**: Secure session handling with refresh tokens
- **Role-based Access Control**: Admin, Team Member, and Client roles

### 2. AI Content Engine
- **Google Gemini Integration**: Advanced AI for content generation
- **Platform-specific Optimization**: Tailored content for each social platform
- **Brand Voice Learning**: AI adapts to your content style and preferences
- **Hashtag Optimization**: Smart hashtag suggestions based on trends and relevance

### 3. Scheduling System
- **Intelligent Timing**: AI-powered optimal posting time recommendations
- **Multi-platform Coordination**: Synchronized posting across platforms
- **Content Calendar**: Visual planning and management interface
- **Automated Publishing**: Scheduled content delivery with error handling

### 4. Analytics Engine
- **Real-time Metrics**: Live performance tracking across all platforms
- **Sentiment Analysis**: AI-powered content sentiment evaluation
- **Performance Prediction**: Machine learning-based engagement forecasting
- **Custom Reports**: Exportable analytics and performance insights

### 5. Email Automation System
- **Welcome Sequences**: Automated onboarding emails for new users
- **OTP Delivery**: Secure two-factor authentication codes
- **Daily Reminders**: Scheduled content notifications
- **Performance Reports**: Automated weekly/monthly analytics summaries

---

## Data Flow

### User Authentication Flow
```
1. User enters credentials → Frontend validation
2. Backend receives request → Password verification
3. OTP generated → Email service sends code
4. User enters OTP → Backend verifies
5. JWT token generated → User authenticated
6. Token stored → Protected routes accessible
```

### Content Creation Flow
```
1. User uploads media → File processing
2. AI analyzes content → Gemini API call
3. Caption generated → Platform optimization
4. User reviews/edits → Content refinement
5. Schedule selected → Database storage
6. Automated publishing → Social media APIs
```

### Analytics Collection Flow
```
1. Social media APIs → Data collection
2. Real-time processing → Metric calculation
3. Database storage → Historical data
4. AI analysis → Insights generation
5. Dashboard update → User visualization
6. Report generation → Email delivery
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