const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabhub';
  try {
    await mongoose.connect(MONGODB_URI, {
      // Connection Pool Settings (CRITICAL for high traffic)
      maxPoolSize: 100,        // Maximum connections in the pool
      minPoolSize: 10,         // Minimum connections to maintain
      maxIdleTimeMS: 30000,    // Close idle connections after 30s
      
      // Timeouts
      serverSelectionTimeoutMS: 5000,  // Timeout for server selection
      socketTimeoutMS: 45000,          // Socket timeout
      connectTimeoutMS: 10000,         // Connection timeout
      
      // Write Concern for better performance
      writeConcern: {
        w: 1,                  // Acknowledge writes from primary only
        wtimeout: 5000         // Write timeout
      },
      
      // Read Preference
      readPreference: 'primaryPreferred',  // Read from primary, fallback to secondary
      
      // Buffering
      bufferCommands: true,
      autoIndex: process.env.NODE_ENV !== 'production', // Disable auto-indexing in production
    });
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📊 Connection Pool: min=${10}, max=${100}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;
