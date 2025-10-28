/**
 * Upload Multiple Attachments Controller
 * @desc    Upload multiple attachments
 * @route   POST /api/upload/attachments
 * @access  Private
 */

import multer from "multer";
import { upload } from "./uploadConfig.js";

export const uploadMultipleAttachments = (req, res) => {
  upload.array("files", 5)(req, res, (err) => {
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

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const files = req.files.map((file) => ({
      name: file.originalname,
      filename: file.filename,
      url: `/uploads/attachments/${file.filename}`,
      size: file.size,
      type: file.mimetype,
    }));

    res.json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      data: { files },
    });
  });
};
