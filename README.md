# RAAHI — Verified Locals • Fair Prices • Zero Worries

> **Production-Ready MERN Stack Travel Marketplace & Anti-Scam Ecosystem**

RAAHI connects domestic and international travelers with verified, hyper-local tour guides across India (Jaipur, Varanasi, Kochi, Delhi, Goa, Mumbai, Agra, Udaipur), backed by a statutory Fare Engine to prevent tourist overcharging, an AI Trip Planner, and real-time OTP booking verification.

---

## 🚀 Tech Stack

### M — MongoDB & Mongoose
- **Database**: MongoDB (Local or Atlas)
- **ODM**: Mongoose 8.x with schemas for `User`, `Guide`, `TourPackage`, `Booking`, `ScamReport`, and `PriceBenchmark`
- **Features**: Dual-mode resilience (graceful offline fallback with pre-seeded datasets, automatic schema indexing, password hashing hooks)

### E — Express.js
- **REST API**: Modular Express architecture (`server/src/routes/`, `controllers/`, `services/`, `middleware/`, `models/`)
- **Real-time Gateway**: Socket.IO integration for instant guide matching and location streaming
- **Security**: JWT Authentication (`jsonwebtoken`), BCrypt password hashing (`bcryptjs`), CORS protection, and centralized error handling

### R — React.js
- **Frontend Framework**: Pure JavaScript React 18+ powered by Vite 5
- **State Management**: Zustand stores (`useAuthStore`, `useBookingStore`, `useGuideStore`, `useTourStore`, `useThemeStore`, `useToastStore`)
- **Styling**: Tailwind CSS with custom theme tokens, modern micro-interactions, dark mode glassmorphism, and responsive layouts
- **Map & Icons**: Leaflet Radar Maps & Lucide Icons

### N — Node.js
- **Runtime**: Node.js (v18+) with standard ES Modules (`"type": "module"`)

---

## 📁 Project Structure

```
RAAHI/
│
├── client/                      # React Frontend (Vite + JavaScript/JSX)
│   ├── src/
│   │   ├── assets/              # Icons, banners, illustrations
│   │   ├── components/          # Reusable UI components & dialogs
│   │   │   ├── inputs/          # OTPInput, specialized form controls
│   │   │   ├── modals/          # AuthModal, BookingModal, ScamReportModal, etc.
│   │   │   ├── AnnouncementBar.jsx
│   │   │   ├── LeafletRadarMap.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── constants/           # Guides and packages constants
│   │   ├── pages/               # 13 Dedicated application pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── GuidesPage.jsx
│   │   │   ├── GuideProfilePage.jsx
│   │   │   ├── ToursPage.jsx
│   │   │   ├── TourDetailsPage.jsx
│   │   │   ├── TourCreatorPage.jsx
│   │   │   ├── FairPricePage.jsx
│   │   │   ├── PlannerPage.jsx
│   │   │   ├── TripsPage.jsx
│   │   │   ├── GuideDashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── BecomeGuidePage.jsx
│   │   │   └── SafetyCenterPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Centralized Axios API service layer
│   │   ├── store/               # Zustand reactive stores
│   │   ├── styles/              # Global CSS & Tailwind design system
│   │   ├── utils/               # Geo calculation & formatting helpers
│   │   ├── App.jsx              # Routing & application shell
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB Mongoose connection & resilience
│   │   ├── controllers/         # Express endpoint controllers
│   │   │   ├── authController.js
│   │   │   ├── guideController.js
│   │   │   ├── tourController.js
│   │   │   ├── bookingController.js
│   │   │   ├── fairPriceController.js
│   │   │   ├── reportController.js
│   │   │   └── plannerController.js
│   │   ├── models/              # Mongoose data models
│   │   │   ├── User.js
│   │   │   ├── Guide.js
│   │   │   ├── TourPackage.js
│   │   │   ├── Booking.js
│   │   │   ├── ScamReport.js
│   │   │   └── PriceBenchmark.js
│   │   ├── routes/              # Express API routers
│   │   ├── middleware/          # JWT protect, authorize, errorHandler
│   │   ├── services/            # Fare engine, seed data service
│   │   ├── utils/               # Constants, socket events, status codes
│   │   └── server.js            # Express server entry point & Socket.IO
│   └── package.json
│
├── .env                         # Root environment configuration
├── .env.example                 # Example template for environment variables
├── .gitignore
├── package.json                 # Monorepo development orchestrator
└── README.md
```

---

## ⚙️ Prerequisites

1. **Node.js**: v18.0.0 or higher (`node -v`)
2. **npm**: v9.0.0 or higher (`npm -v`)
3. **MongoDB** (Optional for dev, recommended for production):
   - Local MongoDB instance on `mongodb://127.0.0.1:27017/raahi` OR
   - MongoDB Atlas connection string URI

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd RAAHI
   ```

2. **Install all dependencies (Root, Client, Server):**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   A `.env.example` file is included in the root directory. Copy it to `.env`:
   ```bash
   cp .env.example .env
   ```

   **Environment Variables (`.env`):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/raahi
   JWT_SECRET=raahi_jwt_secret_token_key_2026_super_secure
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

---

## 💻 Development Commands

From the root project directory:

| Command | Action |
|---|---|
| `npm run dev` | Runs both Express backend and React Vite frontend concurrently |
| `npm run client` | Starts Vite frontend dev server at `http://localhost:5173` |
| `npm run server` | Starts Express backend with nodemon at `http://localhost:5000` |
| `npm run build` | Builds the React frontend production bundle into `client/dist/` |
| `npm start` | Starts the production Express server |
| `npm run install:all` | Installs dependencies for root, client, and server |

---

## 🌐 API Overview

All API endpoints are mounted on both `/api/v1` and `/api` for backwards compatibility.

### 1. Authentication (`/api/auth`)
- `POST /api/auth/send-otp` — Request 6-digit verification OTP (demo code: `123456`)
- `POST /api/auth/verify-otp` — Verify phone OTP and receive JWT authentication token
- `POST /api/auth/register` — Register a new traveler or guide profile
- `POST /api/auth/login` — Sign in with email or phone + password
- `POST /api/auth/logout` — Terminate session
- `GET /api/auth/me` — Retrieve current authenticated user (Protected)
- `PUT /api/auth/profile` — Update user profile & verification status (Protected)

### 2. Guides (`/api/guides`)
- `GET /api/guides` — List verified local guides (supports `?search=`, `?specialty=`, `?radius=`)
- `GET /api/guides/:id` — Retrieve guide profile, rate cards, reviews, and availability
- `PATCH /api/guides/:id/status` — Toggle guide online/offline radar status

### 3. Tour Experiences (`/api/tours`)
- `GET /api/tours` — Explore curated packages (supports `?category=`, `?search=`)
- `GET /api/tours/:id` — Get detailed tour itinerary, highlights, and reviews
- `POST /api/tours` — Create and publish a new tour package
- `POST /api/tours/:id/reviews` — Add traveler review and rating

### 4. Bookings (`/api/bookings`)
- `GET /api/bookings` — Fetch traveler bookings
- `POST /api/bookings` — Create a new booking request with automatic OTP handshake
- `PATCH /api/bookings/:id/status` — Update booking status (`Pending`, `Confirmed`, `Completed`, `Cancelled`)

### 5. Fair Price Checker (`/api/fair-price`)
- `POST /api/fair-price/check` — Analyze quotes against official state motor/guide benchmarks
- `POST /api/fair-price/calculate` — Statutory tariff algorithm breakdown (distance, waiting, night surcharge)
- `GET /api/fair-price/benchmark` — Official RTO rates and city tariffs

### 6. AI Trip Planner (`/api/planner`)
- `POST /api/planner` or `POST /api/planner/generate` — Generate curated day-by-day itineraries matching real RAAHI guide and tour listings

### 7. Scam Reports & Safety (`/api/reports`)
- `GET /api/reports/scam` — Retrieve verified community scam alerts
- `POST /api/reports/scam` — Report overcharging or unauthorized commission traps

---

## 🛡️ Key Features

- **Fair Price Shield**: Real-time statutory tariff calculations to protect travelers against taxi/auto/guide extortion.
- **OTP Start-Code Handshake**: Fraud-prevention protocol requiring the tourist to supply a secret 4-digit code to the guide before an experience starts.
- **Interactive Radar Map**: Live Leaflet-based radar showing verified guides in real-time.
- **Zero Mock Replacements**: All application stores communicate with the Express backend via `client/src/services/api.js`.
- **Pure JavaScript MERN**: Free of any TypeScript configuration or build overhead.

---

## 📄 License
ISC License — RAAHI Travel Technologies © 2026.
