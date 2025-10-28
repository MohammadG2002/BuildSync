/**
 * Disconnect from MongoDB
 */

import mongoose from "mongoose";

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
    throw error;
  }
};
