const router      = require('express').Router();
const Content     = require('../models/Content');
const requireAuth = require('../middleware/auth');

/**
 * GET /api/content
 * Returns all movies and TV shows.
 * Supports optional query filters:
 *   ?type=movie|show   — filter by content type
 *   ?genre=Action      — filter by genre
 *   ?search=batman     — case-insensitive title search
 * Public route — no authentication required.
 */
router.get('/', async (req, res, next) => {
  try {
    const { type, genre, search } = req.query;
    const filter = {};

    if (type)   filter.type  = type;
    if (genre)  filter.genre = genre;
    // Use MongoDB regex for partial, case-insensitive title matching
    if (search) filter.title = { $regex: search, $options: 'i' };

    const items = await Content.find(filter).select('-__v');
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/content/:id
 * Returns a single movie or TV show by its MongoDB ObjectId.
 * Public route — no authentication required.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id).select('-__v');
    if (!item) return res.status(404).json({ message: 'Content not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/content
 * Creates a new movie or TV show entry.
 * Automatically sets createdBy to the authenticated user's ID
 * so ownership can be verified on future edit/delete requests.
 * Protected route — valid JWT required.
 */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const item = await Content.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/content/:id
 * Updates an existing movie or TV show.
 * Authorization check: only the user who created the entry can edit it.
 * Seeded content (createdBy = null) cannot be modified by any user.
 * Protected route — valid JWT required.
 */
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Content not found' });

    // Reject if content is seeded (no owner) or belongs to a different user
    if (!item.createdBy || item.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this content' });
    }

    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      new: true,          // return the updated document
      runValidators: true, // enforce schema validation on update
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/content/:id
 * Permanently deletes a movie or TV show.
 * Authorization check: only the user who created the entry can delete it.
 * Seeded content (createdBy = null) is protected from deletion.
 * Protected route — valid JWT required.
 */
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Content not found' });

    // Reject if content is seeded (no owner) or belongs to a different user
    if (!item.createdBy || item.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this content' });
    }

    await item.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
