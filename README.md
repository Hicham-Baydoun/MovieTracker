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

---

## Assigned Topic and Primary Data Entities

* **Assigned Topic:** Build a full-stack movie and TV show tracker with real database storage, JWT authentication, and a REST API.

Primary data entities:

* **Movie**: `id`, `tmdbId`, `title`, `year`, `genre[]`, `rating`, `duration`, `director`, `cast[]`, `synopsis`, `poster`, `type`, `createdBy`
* **TVShow**: `id`, `tmdbId`, `title`, `year`, `genre[]`, `rating`, `seasons`, `episodes`, `creator`, `cast[]`, `synopsis`, `poster`, `type`, `createdBy`
* **User**: `id`, `username`, `email`, `password` (hashed), `avatar`, `watchlist[]`, `joinedDate`

---

## Deployed Application Links

| Service | URL |
|---|---|
| **Frontend (Vercel)** | https://movie-tracker-murex.vercel.app |
| **Backend API (Railway)** | https://movietracker-production-3a69.up.railway.app |
| **Health check** | https://movietracker-production-3a69.up.railway.app/api/health |

---

## Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Browse Page
![Browse Page](screenshots/browse.png)

### Movie Details
![Details Page](screenshots/details.png)

### Add / Edit Content
![Add Edit Page](screenshots/add-edit.png)

### Profile & Watchlist
![Profile Page](screenshots/profile.png)

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

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:5000
```

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
| `npm run seed` (backend/) | Seed 100 TMDB items into MongoDB |

---

## API Documentation

Base URL (production): `https://movietracker-production-3a69.up.railway.app`

Authentication is via **httpOnly JWT cookie** set automatically on login/register. Include `credentials: 'include'` in every fetch call. Endpoints marked **Cookie required** return `401` if the cookie is absent or expired.

---

### Content

#### `GET /api/content`
List all movies and TV shows. Supports query params: `?type=movie|tv`, `?genre=Action`, `?search=inception`.

**Response `200`**
```json
[
  {
    "_id": "6650a1b2c3d4e5f6a7b8c9d0",
    "tmdbId": 550,
    "title": "Fight Club",
    "year": 1999,
    "genre": ["Drama", "Thriller"],
    "rating": 8.8,
    "duration": 139,
    "director": "David Fincher",
    "cast": ["Brad Pitt", "Edward Norton"],
    "synopsis": "An insomniac office worker...",
    "poster": "https://image.tmdb.org/t/p/w500/...",
    "type": "movie",
    "createdBy": null
  }
]
```

---

#### `GET /api/content/:id`
Get a single movie or TV show by its MongoDB `_id`.

**Response `200`** — same shape as a single object from the list above.

**Response `404`**
```json
{ "message": "Content not found" }
```

---

#### `POST /api/content` — *Cookie required*
Add a new movie or TV show. The `createdBy` field is set automatically from the JWT.

**Request body**
```json
{
  "title": "My Movie",
  "year": 2024,
  "type": "movie",
  "genre": ["Action"],
  "rating": 7.5,
  "duration": 120,
  "director": "Jane Doe",
  "cast": ["Actor One", "Actor Two"],
  "synopsis": "A great film.",
  "poster": "https://example.com/poster.jpg"
}
```

**Response `201`** — the created document (same shape as GET, with `createdBy` set to the user's `_id`).

**Response `401`**
```json
{ "message": "Not authenticated" }
```

---

#### `PUT /api/content/:id` — *Cookie required, owner only*
Update an existing user-created entry. Seeded TMDB entries (`createdBy: null`) cannot be edited.

**Request body** — any subset of the content fields (partial update supported).

**Response `200`** — the updated document.

**Response `403`**
```json
{ "message": "Not authorized to edit this content" }
```

---

#### `DELETE /api/content/:id` — *Cookie required, owner only*
Delete a user-created entry.

**Response `200`**
```json
{ "message": "Content deleted" }
```

**Response `403`**
```json
{ "message": "Not authorized to delete this content" }
```

---

### Auth

#### `POST /api/auth/register`
Create a new account. Sets an httpOnly JWT cookie on success.

**Request body**
```json
{
  "username": "hicham",
  "email": "hicham@example.com",
  "password": "secret123"
}
```

**Response `201`**
```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d1",
  "username": "hicham",
  "email": "hicham@example.com",
  "avatar": "",
  "watchlist": [],
  "joinedDate": "2026-04-26T00:00:00.000Z"
}
```

**Response `400`**
```json
{ "message": "Email already in use" }
```

---

#### `POST /api/auth/login`
Sign in. Sets an httpOnly JWT cookie on success.

**Request body**
```json
{
  "email": "hicham@example.com",
  "password": "secret123"
}
```

**Response `200`** — same user object as register.

**Response `401`**
```json
{ "message": "Invalid credentials" }
```

---

#### `POST /api/auth/logout`
Clears the JWT cookie.

**Response `200`**
```json
{ "message": "Logged out" }
```

---

#### `GET /api/auth/me` — *Cookie required*
Restore session on page load without re-entering credentials.

**Response `200`** — the logged-in user object (same shape as register response).

**Response `401`**
```json
{ "message": "Not authenticated" }
```

---

### Users

#### `GET /api/users/profile` — *Cookie required*
Get the logged-in user's profile including their watchlist IDs.

**Response `200`**
```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d1",
  "username": "hicham",
  "email": "hicham@example.com",
  "avatar": "",
  "watchlist": ["6650a1b2c3d4e5f6a7b8c9d0"],
  "joinedDate": "2026-04-26T00:00:00.000Z"
}
```

---

#### `GET /api/users/watchlist` — *Cookie required*
Get the watchlist as fully populated content objects (not just IDs).

**Response `200`** — array of content objects (same shape as `GET /api/content`).

---

#### `POST /api/users/watchlist/:id` — *Cookie required*
Add a content item to the watchlist. Uses `$addToSet` so duplicates are ignored.

**Response `200`**
```json
{ "message": "Added to watchlist" }
```

---

#### `DELETE /api/users/watchlist/:id` — *Cookie required*
Remove a content item from the watchlist.

**Response `200`**
```json
{ "message": "Removed from watchlist" }
```

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

## Technical Challenges

### 1 — Missing file not caught by local dev
`backend/src/middleware/errorHandler.js` existed locally but had never been committed to git. The first Render deployment failed with `Cannot find module './middleware/errorHandler'`. The fix was to commit and push the missing file — a reminder that `git status` should always be checked before declaring the project "done."

### 2 — Server not reachable after deploy (502 Bad Gateway)
After the errorHandler was committed, the server started but Render returned 502 on every request. The root cause was `app.listen(PORT)` binding only to `127.0.0.1` (localhost) inside the container, which is unreachable from the outside. Fixing it to `app.listen(PORT, '0.0.0.0', ...)` resolved it immediately.

### 3 — CORS blocking the frontend
Render generates unique preview URLs per deployment (e.g. `movietracker-cxnd.onrender.com`). Hard-coding the allowed origin list broke every new preview deploy. The solution was to replace the origin allowlist with a dynamic header that reflects whatever `Origin` the browser sent, combined with `Access-Control-Allow-Credentials: true`, so any origin (including Vercel previews) is accepted without changing code.

### 4 — Railway deploying the Vite frontend instead of Express
The repo root contains the frontend `package.json` with a `dev` script that runs Vite. Railway's auto-detection picked that up and tried to serve the React app instead of the backend. Adding a `railway.json` config file at the repo root with an explicit `buildCommand` (`cd backend && npm install`) and `startCommand` (`cd backend && node src/index.js`) told Railway exactly what to build and run.

### 5 — Port mismatch on Railway
Railway injects a `PORT` environment variable (often `8080`) and routes external traffic to the port configured in the project's Networking settings. The server was running on `8080` (from Railway's `PORT`) but the public domain was configured to forward to `5000`. Every request timed out with "Application failed to respond." Changing the Networking port to match `8080` fixed it.

### 6 — MongoDB Atlas blocking Railway's IP
MongoDB Atlas Network Access was set to allow only the developer's home IP. Railway containers run on dynamic cloud IPs, so every connection attempt was refused. Adding `0.0.0.0/0` to Atlas Network Access (allow all IPs) resolved it for a cloud-hosted backend where IP pinning is not practical.

### 7 — JWT_SECRET with a hidden tab character
The backend was receiving requests, the cookie was being set, but `/api/auth/me` returned 401 on every page load even with a valid cookie. Railway's environment variable editor had auto-inserted a tab character before `JWT_SECRET`, making the actual variable name `\tJWT_SECRET`. The server signed tokens with one key and verified with `undefined`. Deleting and retyping the variable name manually in Railway's dashboard fixed it.

### 8 — Vite baking the wrong API URL at build time
`VITE_API_URL` is inlined at build time — changing it in Vercel's environment variables has no effect until the project is redeployed. After deploying the backend to Railway the frontend still pointed at the old Render URL because the Vercel build hadn't been triggered. A forced redeploy on Vercel with the updated `VITE_API_URL` resolved it.

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
│   │   │   ├── auth.js            # JWT verification middleware
│   │   │   └── errorHandler.js   # Global error handler
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
├── railway.json                   # Railway build/start config
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5, Vite 7, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT + bcrypt, httpOnly cookies |
| Data source | TMDB API v3 |
| Deployment | Vercel (frontend) · Railway (backend) |
