const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Called once at server startup — if this fails the process exits
 * rather than running with no database connection.
 */
async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = connectDB;
