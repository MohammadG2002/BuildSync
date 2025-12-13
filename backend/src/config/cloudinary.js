/**
 * Cloudinary Configuration
 * Cloud storage for persistent file uploads (avatars, attachments)
 */

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const configureCloudinary = () => {
  if (process.env.CLOUDINARY_URL) {
    // If CLOUDINARY_URL is set, cloudinary auto-configures
    cloudinary.config({
      secure: true,
    });
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
};

configureCloudinary();

export default cloudinary;
