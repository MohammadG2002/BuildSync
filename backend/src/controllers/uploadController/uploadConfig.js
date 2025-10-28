/**
 * Upload Configuration
 * Multer storage and file filter configuration for file uploads
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../../uploads");
const avatarsDir = path.join(uploadsDir, "avatars");
const attachmentsDir = path.join(uploadsDir, "attachments");

[uploadsDir, avatarsDir, attachmentsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadType = req.path.includes("avatar") ? "avatars" : "attachments";
    const dest = uploadType === "avatars" ? avatarsDir : attachmentsDir;
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images for avatars
  if (req.path.includes("avatar")) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for avatars"), false);
    }
  } else {
    // Allow common file types for attachments
    const allowedTypes = [
      "image/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/",
      "application/zip",
      "application/x-zip-compressed",
    ];

    const isAllowed = allowedTypes.some((type) => file.mimetype.includes(type));

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  }
};

// Create multer instance
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

export { uploadsDir };
