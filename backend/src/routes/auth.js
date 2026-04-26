const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// Cookie options — httpOnly prevents JS access (XSS protection)
// secure + sameSite=none required for cross-origin cookie in production
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Sign a JWT containing the user's id and username
function makeToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Strip sensitive fields before sending user data to the client
function sanitize(user) {
  return {
    id:         user._id,
    username:   user.username,
    email:      user.email,
    avatar:     user.avatar,
    watchlist:  user.watchlist,
    joinedDate: user.joinedDate,
  };
}

/**
 * POST /api/auth/register
 * Creates a new user account.
 * Password is hashed with bcrypt (cost factor 12) before storing.
 * Returns a JWT cookie and sanitized user object on success.
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate email or username before creating the account
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ username, email, password: hashed });
    const token  = makeToken(user);

    // Set JWT as httpOnly cookie instead of returning in body for security
    res.cookie('token', token, COOKIE_OPTIONS)
       .status(201)
       .json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Authenticates an existing user.
 * Uses bcrypt.compare to verify password against stored hash.
 * Returns a JWT cookie and sanitized user object on success.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    // Use a single generic error to avoid leaking whether email exists
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = makeToken(user);
    res.cookie('token', token, COOKIE_OPTIONS)
       .json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Clears the JWT cookie to end the session.
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 })
     .json({ message: 'Logged out' });
});

/**
 * GET /api/auth/me
 * Verifies the JWT cookie and returns the current user.
 * Called on app load to restore an existing session without re-login.
 */
router.get('/me', async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id)
      .populate('watchlist')
      .select('-password -__v');

    if (!user) return res.status(401).json({ message: 'User not found' });
    res.json({ user: sanitize(user) });
  } catch {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
});

module.exports = router;
