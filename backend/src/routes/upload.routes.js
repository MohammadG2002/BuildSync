import express from "express";
import rateLimit from "express-rate-limit";
import {
  uploadAvatar,
  uploadAttachment,
  uploadMultipleAttachments,
  deleteFile,
} from "../controllers/uploadController/index.js";
import { authenticate } from "../middleware/index.js";

const router = express.Router();

// Custom rate limiter for uploads (more lenient than default)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
});

// All routes require authentication
router.use(authenticate);

// Apply lenient rate limiter to upload routes
router.post("/avatar", uploadLimiter, uploadAvatar);
router.post("/attachment", uploadLimiter, uploadAttachment);
router.post("/attachments", uploadLimiter, uploadMultipleAttachments);
router.delete("/:type/:filename", deleteFile);

export default router;
