/**
 * Delete File Controller
 * @desc    Delete file
 * @route   DELETE /api/upload/:type/:filename
 * @access  Private
 */

import fs from "fs";
import path from "path";
import { uploadsDir } from "./uploadConfig.js";

export const deleteFile = (req, res) => {
  try {
    const { type, filename } = req.params;

    if (!["avatars", "attachments"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type",
      });
    }

    const filePath = path.join(uploadsDir, type, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
};
