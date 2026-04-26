const jwt = require('jsonwebtoken');

/**
 * requireAuth middleware — protects routes that need a logged-in user.
 *
 * Checks for a JWT in two places:
 *   1. httpOnly cookie (browser requests — most secure)
 *   2. Authorization header (Postman / API testing)
 *
 * On success, attaches the decoded payload to req.user so route
 * handlers can access req.user.id without querying the database again.
 */
module.exports = function requireAuth(req, res, next) {
  const token =
    req.cookies?.token ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
