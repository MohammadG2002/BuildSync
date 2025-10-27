import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
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
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

// @desc    Upload avatar
// @route   POST /api/upload/avatar
// @access  Private
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

    const fileUrl = `/uploads/avatars/${req.file.filename}`;

    res.json({
      success: true,
      message: "Avatar uploaded successfully",
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  });
};

// @desc    Upload attachment
// @route   POST /api/upload/attachment
// @access  Private
export const uploadAttachment = (req, res) => {
  upload.single("file")(req, res, (err) => {
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

    const fileUrl = `/uploads/attachments/${req.file.filename}`;

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        name: req.file.originalname,
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        type: req.file.mimetype,
      },
    });
  });
};

// @desc    Upload multiple attachments
// @route   POST /api/upload/attachments
// @access  Private
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

// @desc    Delete file
// @route   DELETE /api/upload/:type/:filename
// @access  Private
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
