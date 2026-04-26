# Code Weavers - Movie and TV Show Tracker (Phase 2)

Full-stack application for CSC443 built with React, TypeScript, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Project Title and Team Member Names

* **Project Title:** Movie and TV Show Tracker
* **Team Name:** Code Weavers
* **Course:** CSC443 - Spring 2026
* **Team Member 1:** Hicham Baydoun
* **Team Member 2:** Nour Al Housa Al Omari
* **Team Member 3:** Kassem Nader
* **Team Member 4:** Dana Tello

## Assigned Topic and Primary Data Entities

* **Assigned Topic:** Build a full-stack movie and TV show tracker with real database storage, JWT authentication, and a REST API.

Primary data entities:

* **Movie**: `id`, `tmdbId`, `title`, `year`, `genre[]`, `rating`, `duration`, `director`, `cast[]`, `synopsis`, `poster`, `type`, `createdBy`
* **TVShow**: `id`, `tmdbId`, `title`, `year`, `genre[]`, `rating`, `seasons`, `episodes`, `creator`, `cast[]`, `synopsis`, `poster`, `type`, `createdBy`
* **User**: `id`, `username`, `email`, `password` (hashed), `avatar`, `watchlist[]`, `joinedDate`

## Deployed Application Link

[Open the deployed app](https://hicham-baydoun.github.io/MovieTracker/)

---

## Local Setup Instructions

### Prerequisites

* Node.js `20+`
* npm `10+`
* A `.env` file in `backend/` (see below)

### 1 — Clone the repo

```bash
git clone https://github.com/Hicham-Baydoun/MovieTracker.git
cd app
```

### 2 — Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<any long random string>
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3 — Frontend

In a separate terminal from the project root:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

### Useful Scripts

| Command | Description |
|---|---|
| `npm run dev` (root) | Start frontend dev server |
| `npm run build` (root) | Production build in `dist/` |
| `npm run dev` (backend/) | Start backend with nodemon |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/content` | No | List all movies and shows (supports `?type=`, `?genre=`, `?search=`) |
| GET | `/api/content/:id` | No | Get a single item |
| POST | `/api/content` | Yes | Add a new movie or show |
| PUT | `/api/content/:id` | Yes | Update (owner only) |
| DELETE | `/api/content/:id` | Yes | Delete (owner only) |
| POST | `/api/auth/register` | No | Create account, returns JWT cookie |
| POST | `/api/auth/login` | No | Sign in, returns JWT cookie |
| POST | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/me` | Cookie | Restore session on page load |
| GET | `/api/users/profile` | Yes | Get logged-in user profile + watchlist |
| GET | `/api/users/watchlist` | Yes | Get watchlist as full content objects |
| POST | `/api/users/watchlist/:id` | Yes | Add item to watchlist |
| DELETE | `/api/users/watchlist/:id` | Yes | Remove item from watchlist |

---

## Team Member Contributions (Phase 2 — Backend)

### Hicham Baydoun
* **`backend/src/index.js`** — Server entry point. Wires up CORS (with credentials for cookie support), middleware stack, all route prefixes, and the global error handler.
* **`backend/src/routes/content.js`** — Full CRUD for movies and TV shows. Includes search, genre and type filters, and ownership checks that prevent users from editing or deleting seeded TMDB content.

### Dana Tello
* **`backend/src/routes/auth.js`** — Register, login, logout, and session-restore endpoints. Handles bcrypt password hashing, JWT signing, and httpOnly cookie management.
* **`backend/src/middleware/auth.js`** — `requireAuth` middleware that verifies the JWT from the cookie or Authorization header and attaches the decoded user to `req.user`.

### Kassem Nader
* **`backend/src/routes/users.js`** — Profile and watchlist endpoints. Uses MongoDB `$addToSet` and `$pull` for safe watchlist add/remove, and `populate()` to return full content objects instead of raw IDs.
* **`backend/src/config/db.js`** — MongoDB Atlas connection function called once at server startup via Mongoose.

### Nour Al Housa Al Omari
* **`backend/src/models/User.js`** — Mongoose schema for user accounts. Stores a watchlist as an array of `ObjectId` references to Content documents.
* **`backend/src/models/Content.js`** — Unified Mongoose schema for both movies and TV shows. Uses `createdBy: null` to mark seeded TMDB content as read-only, and an ObjectId when a user creates an entry.

---

## Phase 1 Contributions (Frontend)

1. **Hicham Baydoun** — Add/Edit page (`/add`, `/edit/:id`) and Browse page (`/browse`)
2. **Nour Al Housa Al Omari** — Movie Details (`/movies/:id`) and TV Show Details (`/shows/:id`)
3. **Kassem Nader** — Homepage (`/`) and Profile page (`/profile`)
4. **Dana Tello** — Login page (`/login`) and Register page (`/register`)

---

## How the Backend Works

* All content (100 items — 50 movies, 50 TV shows) is seeded from the TMDB API into MongoDB Atlas.
* Authentication uses **JWT stored in an httpOnly cookie**, which the browser sends automatically on every request. This keeps the token out of JavaScript and protects against XSS.
* The React frontend calls the backend via `apiFetch()` (`src/lib/api.ts`) with `credentials: 'include'` so cookies travel with every request.
* On app load, the frontend calls `/api/auth/me` in parallel with `/api/content` to restore the session without blocking the library from loading.
* Content entries with `createdBy: null` are seeded/read-only. Entries a user adds themselves have `createdBy` set to their user ID and can only be edited or deleted by them.

---

## Project Structure

```text
app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification middleware
│   │   ├── models/
│   │   │   ├── Content.js         # Movie + TV show schema
│   │   │   └── User.js            # User schema
│   │   ├── routes/
│   │   │   ├── auth.js            # Auth endpoints
│   │   │   ├── content.js         # Content CRUD
│   │   │   └── users.js           # Profile + watchlist
│   │   └── index.js               # Server entry point
│   └── package.json
├── src/
│   ├── components/
│   ├── context/
│   │   └── AppDataContext.tsx     # Global state + API calls
│   ├── lib/
│   │   └── api.ts                 # Central fetch wrapper
│   ├── pages/
│   │   ├── Homepage.tsx
│   │   ├── Browse.tsx
│   │   ├── Details.tsx
│   │   ├── AddEdit.tsx
│   │   ├── Profile.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── App.tsx
│   └── main.tsx
└── README.md
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5, Vite 7, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt, httpOnly cookies |
| Data source | TMDB API v3 |
| Deployment | Vercel (frontend) · Render (backend) |
