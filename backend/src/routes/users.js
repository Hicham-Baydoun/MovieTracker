const router      = require('express').Router();
const User        = require('../models/User');
const requireAuth = require('../middleware/auth');

/**
 * GET /api/users/profile
 * Returns the logged-in user's full profile with watchlist populated.
 * The watchlist field stores ObjectIds — populate replaces them with
 * the actual content documents so the client doesn't need a second request.
 */
router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist')
      .select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/users/watchlist
 * Returns the current user's watchlist as full content objects.
 */
router.get('/watchlist', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist')
      .select('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/users/watchlist/:contentId
 * Adds a movie or show to the user's watchlist.
 * $addToSet prevents duplicate entries automatically.
 */
router.post('/watchlist/:contentId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { watchlist: req.params.contentId } },
      { new: true }
    ).select('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/users/watchlist/:contentId
 * Removes a movie or show from the user's watchlist.
 * $pull removes the matching ID from the array.
 */
router.delete('/watchlist/:contentId', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { watchlist: req.params.contentId } },
      { new: true }
    ).select('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
