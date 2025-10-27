import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Set test environment variables
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing";
process.env.JWT_EXPIRE = "7d";
process.env.NODE_ENV = "test";

let mongoServer;

// Setup test database before all tests
export const setupTestDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
};

// Cleanup after all tests
export const teardownTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Clear all collections between tests
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
