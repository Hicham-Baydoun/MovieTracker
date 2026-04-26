const mongoose = require('mongoose');

/**
 * Unified schema for both movies and TV shows.
 * The `type` field ('movie' | 'show') determines which fields are relevant —
 * movies use duration/director, shows use seasons/episodes/creator.
 *
 * createdBy links user-created entries to their owner for authorization.
 * Seeded content from TMDB has createdBy = null, making it read-only
 * (the content routes reject edit/delete attempts on null-owner entries).
 */
const contentSchema = new mongoose.Schema(
  {
    tmdbId:    { type: Number, default: null },
    type:      { type: String, enum: ['movie', 'show'], required: true },
    title:     { type: String, required: true },
    year:      { type: Number },
    genre:     [String],
    rating:    { type: Number, default: 0 },
    synopsis:  { type: String, default: '' },
    poster:    { type: String, default: '' },
    cast:      [String],

    // Movie-specific fields
    duration:  { type: String },
    director:  { type: String },

    // TV show-specific fields
    seasons:   { type: Number },
    episodes:  { type: Number },
    creator:   { type: String },

    // null = seeded/read-only, ObjectId = user-created and editable
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Content', contentSchema);
