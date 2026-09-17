import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (env.MONGODB_URI) {
      console.log(`Connecting to configured MongoDB URI...`);
      // Connect to configured MongoDB cluster
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB cluster successfully.');
      return;
    }
    throw new Error('No MONGODB_URI specified');
  } catch (error: any) {
    console.warn(`⚠️ Could not connect to primary MongoDB URI (${error.message}).`);
    console.log('🔄 Starting In-Memory MongoDB Server fallback...');
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ Connected to In-Memory MongoDB at ${mongoUri}`);
    } catch (memError: any) {
      console.error('❌ Failed to start In-Memory MongoDB server:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
