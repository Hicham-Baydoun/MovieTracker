require('dotenv').config();
const express      = require('express');
const cors         = require('cors');
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB    = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB Atlas — exit process if connection fails at startup
connectDB().catch(err => {
  console.error('DB connection failed:', err.message);
  process.exit(1);
});

// Allow requests from the frontend — accepts the production URL, any Vercel
// preview deployment for this project, and localhost for local development.
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow server-to-server / curl
    const ok =
      ALLOWED_ORIGINS.includes(origin) ||
      /https:\/\/movie-tracker-.*\.vercel\.app$/.test(origin);
    cb(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true,
}));

app.use(morgan('dev'));      // HTTP request logger for development
app.use(express.json());    // Parse incoming JSON request bodies
app.use(cookieParser());    // Parse cookies (needed for JWT httpOnly cookie auth)

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));     // register, login, logout, me
app.use('/api/content', require('./routes/content')); // CRUD for movies and TV shows
app.use('/api/users',   require('./routes/users'));   // profile and watchlist

// Health check endpoint — used by deployment platforms to verify the server is up
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Global error handler — catches any errors passed via next(err)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
