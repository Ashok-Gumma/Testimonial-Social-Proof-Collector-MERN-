# ProofPulse — Testimonial & Social Proof Collector (MERN)

> A premium, production-grade MERN SaaS application inspired by **Linear, Stripe, and Senja** for collecting, moderating, analyzing, and embedding customer testimonials and social proof.

---

## 🚀 Key Features

* **🎨 Modern Linear / Senja Aesthetic**: Dark theme, glassmorphism panel cards, aurora gradient backgrounds, and micro-interactions.
* **🔐 Production Security**: JWT 15-minute Access Token + 7-day `httpOnly` Refresh Token rotation, bcrypt hashing, and protected dashboard guards.
* **⚡ Zero-Setup Database Readiness**: Automatic fallback to in-memory MongoDB (`mongodb-memory-server`) with pre-seeded demo data if no external MongoDB URI is provided.
* **📌 Branded Collection Spaces**: Public submission links (`/submit/:slug`) with logo upload, custom prompts, toggles for avatar/rating, and dynamic custom question builders.
* **🎉 Interactive Public Form**: Star rating selector, custom questions, avatar photo upload, and instant **Confetti Fireworks Celebration**.
* **📥 Moderation Inbox**: Filter by status (`All`, `Pending`, `Approved`, `Rejected`, `Archived`), star ratings (1 to 5), search, and **Multi-Select Bulk Actions** (Approve, Archive, Delete).
* **📊 Visual Analytics**: KPIs for average score, total reviews, pending inbox, star distribution progress bars, and a 30-day feedback volume trend chart.
* **❤️ Public Wall of Love**: Shareable showcase pages (`/wall/:slug`) with Pinterest-style **Masonry Grid** and **Carousel Slider** views.
* **💻 Embed Generator**: Real-time widget builder supporting Masonry Grid, Carousel, and Floating Badge widgets with copyable **HTML Script** and **Iframe** code snippets.

---

## 🛠 Tech Stack

* **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, TanStack Query, React Hook Form + Zod, Canvas Confetti.
* **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT (Access & Refresh), Cookie Parser, Bcrypt, Multer (file uploads), Zod.

---

## ⚡ Quick Start

### 1. Install All Dependencies
Run from workspace root:
```bash
npm run install:all
```

### 2. Start Development Servers
Run both backend API and frontend Vite server concurrently:
```bash
npm run dev
```
* **Frontend**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000](http://localhost:5000)

### 3. Quick Start & Demo Spaces
* **Sign Up / Sign In**: Register a new account or log in with your credentials.
* **Instant Demo Spaces**: Click the **"Load Demo Spaces"** button on the Spaces dashboard to automatically populate pre-configured branded spaces (`Acme SaaS Platform`, `Linear Craft Studio`) with diverse verified testimonials, star ratings, and moderation states.


---

## 📁 Directory Structure

```
Testimonial & Social Proof Collector(MERN)/
├── package.json                         # Root workspace scripts
├── README.md                            # Complete documentation
├── .env.example                         # Environment settings template
│
├── server/                              # Node.js + Express Backend
│   ├── src/
│   │   ├── config/                      # Database (with Memory Server fallback) & Env validation
│   │   ├── controllers/                 # Auth, Space, Testimonial, Analytics logic
│   │   ├── middleware/                  # JWT auth, Multer file upload, Global error handler
│   │   ├── models/                      # User, Space, Testimonial schemas
│   │   ├── routes/                      # API endpoint definitions
│   │   ├── utils/                       # Token generation & Database seeder
│   │   └── server.ts                    # Express entrypoint
│   └── uploads/                         # Statically served logos & avatars
│
└── client/                              # React 19 + Vite Frontend
    ├── src/
    │   ├── api/                         # Axios client with automatic refresh token interceptors
    │   ├── components/
    │   │   ├── common/                  # GlassCard, Button, Input, StarRating, Badge, Modal
    │   │   ├── layout/                  # Navbar, Sidebar, DashboardLayout
    │   │   └── widgets/                 # MasonryGrid, CarouselWidget, BadgeWidget
    │   ├── context/                     # AuthContext with silent token refresh
    │   ├── pages/
    │   │   ├── public/                  # Landing, Login, Signup, Collect, Wall of Love, Embeds
    │   │   └── dashboard/               # Overview, Spaces, Moderation, Analytics, Embed Generator
    │   └── App.tsx                      # Router configuration
```

---

## 📡 API Endpoint Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Create new user account |
| `POST` | `/api/auth/login` | Authenticate & issue token pair |
| `POST` | `/api/auth/refresh` | Rotate refresh token cookie & issue new access token |
| `GET` | `/api/auth/verify-email` | Verify email address token |
| `POST` | `/api/auth/forgot-password` | Request password reset token |
| `POST` | `/api/auth/reset-password` | Reset password using valid token |
| `POST` | `/api/auth/logout` | Revoke session & clear refresh cookie |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

### 🚀 Spaces (`/api/spaces`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/spaces` | Get user's spaces with aggregated review stats |
| `POST` | `/api/spaces` | Create branded space with logo upload & prompt |
| `POST` | `/api/spaces/seed-demo` | Seed demo spaces and rich testimonials for user account |
| `GET` | `/api/spaces/:id` | Get single space configuration |
| `GET` | `/api/spaces/public/:slug` | Public endpoint for collection form & Wall of Love |
| `PATCH` | `/api/spaces/:id` | Update space settings & questions |
| `DELETE` | `/api/spaces/:id` | Delete space and all associated testimonials |


### ⭐ Testimonials (`/api/testimonials`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/testimonials/submit` | Public submission form endpoint |
| `GET` | `/api/testimonials/public/:slug` | Public approved reviews for Wall of Love & Embeds |
| `GET` | `/api/testimonials/space/:spaceId` | Moderation inbox feed with status/rating/search filters |
| `PATCH` | `/api/testimonials/:id/status` | Update status (`approved`, `rejected`, `archived`) |
| `PATCH` | `/api/testimonials/:id/feature` | Toggle featured star badge |
| `PATCH` | `/api/testimonials/:id/like` | Toggle heart like state |
| `POST` | `/api/testimonials/bulk` | Bulk status update or bulk deletion |
| `DELETE` | `/api/testimonials/:id` | Delete single testimonial |

---

## 📄 License
MIT License. Built for Technical Interview Assessment.
