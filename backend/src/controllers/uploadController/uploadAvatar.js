/**
 * Upload Avatar Controller
 * @desc    Upload avatar
 * @route   POST /api/upload/avatar
 * @access  Private
 */

import multer from "multer";
import { upload, useCloudinary, cloudinary } from "./uploadConfig.js";

export const uploadAvatar = (req, res) => {
  upload.single("avatar")(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    try {
      let fileUrl, filename;

      if (useCloudinary) {
        // Upload to Cloudinary using buffer from memory storage
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: "buildsync/avatars",
              resource_type: "image",
              transformation: [{ width: 400, height: 400, crop: "limit" }],
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        fileUrl = result.secure_url;
        filename = result.public_id;
      } else {
        // Local storage - build absolute URL
        const relativePath = `/uploads/avatars/${req.file.filename}`;
        const origin = `${req.protocol}://${req.get("host")}`;
        fileUrl = `${origin}${relativePath}`;
        filename = req.file.filename;
      }

      res.json({
        success: true,
        message: "Avatar uploaded successfully",
        data: {
          filename,
          url: fileUrl,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Avatar upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload avatar",
      });
    }
  });
};
