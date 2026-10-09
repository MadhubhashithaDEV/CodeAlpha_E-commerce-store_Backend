const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/velora_clothing_db';
    console.log(`Connecting to MongoDB at: ${connStr}`);
    
    // Attempt standard connection
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`Primary MongoDB Connection warning: ${error.message}`);
    console.log('Attempting in-memory MongoDB server fallback...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected at: ${uri}`);
      return conn;
    } catch (memError) {
      console.error(`In-Memory MongoDB failed: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
