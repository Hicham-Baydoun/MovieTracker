const mongoose = require('mongoose');

/**
 * User schema — stores account info and a watchlist of saved content.
 * Passwords are never stored in plain text; the route layer hashes them
 * with bcrypt before calling User.create().
 *
 * watchlist holds ObjectId references to Content documents.
 * Using ref: 'Content' lets Mongoose populate full content objects
 * when the profile or watchlist endpoints are called.
 */
const userSchema = new mongoose.Schema({
  username:   { type: String, required: true, unique: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },
  avatar:     { type: String, default: '' },
  watchlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  joinedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
