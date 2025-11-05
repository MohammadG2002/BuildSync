/**
 * Upload Avatar Controller
 * @desc    Upload avatar
 * @route   POST /api/upload/avatar
 * @access  Private
 */

import multer from "multer";
import { upload } from "./uploadConfig.js";

export const uploadAvatar = (req, res) => {
  upload.single("avatar")(req, res, (err) => {
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

    // Build absolute URL so the frontend opens from the backend origin
    const relativePath = `/uploads/avatars/${req.file.filename}`;
    const origin = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${origin}${relativePath}`;

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
        // Provide relative path as well for compatibility if needed
        relativeUrl: relativePath,
      },
    });
  });
};
