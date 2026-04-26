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

// Manually set CORS headers before anything else so every response
// including preflight OPTIONS has the right headers.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

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
