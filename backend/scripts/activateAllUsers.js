import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User/index.js";

dotenv.config({ path: "./.env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env");
  process.exit(1);
}

const activateAll = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await User.updateMany({}, { $set: { isActive: true } });
    console.log(
      `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
    );

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to activate users:", err);
    process.exit(1);
  }
};

activateAll();
