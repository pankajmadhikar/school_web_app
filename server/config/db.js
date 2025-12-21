import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    // Remove any quotes or extra whitespace
    const cleanUri = mongoUri.trim().replace(/^["']|["']$/g, '');

    const conn = await mongoose.connect(cleanUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.message.includes('Invalid scheme')) {
      console.error('\n⚠️  Your MONGODB_URI connection string is invalid.');
      console.error('It should start with "mongodb://" or "mongodb+srv://"');
      console.error('Example: mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority');
    }
    process.exit(1);
  }
};

export default connectDB;

