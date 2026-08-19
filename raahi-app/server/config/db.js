const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/raahi_db';
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[RAAHI DB] MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[RAAHI DB Error] Connection Failed: ${error.message}`);
    // Non-fatal fallback warning for dev mode
    console.warn('[RAAHI DB Warning] Running with local fallback mode if MongoDB instance is unreachable.');
  }
};

module.exports = connectDB;
