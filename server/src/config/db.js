import mongoose from 'mongoose';

// Disable query buffering so offline mode fails fast and uses seed data without lag
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/raahi';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`⚠️ Note: Ensure MongoDB is running locally or specify a remote MONGODB_URI in .env`);
    return null;
  }
};

export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Handle process termination gracefully
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (err) {
    process.exit(1);
  }
});
