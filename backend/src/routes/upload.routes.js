import express from "express";
import {
  uploadAvatar,
  uploadAttachment,
  uploadMultipleAttachments,
  deleteFile,
} from "../controllers/uploadController/index.js";
import { authenticate } from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post("/avatar", uploadAvatar);
router.post("/attachment", uploadAttachment);
router.post("/attachments", uploadMultipleAttachments);
router.delete("/:type/:filename", deleteFile);

export default router;
