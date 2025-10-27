import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
} from "../controllers/notification.controller.js";
import { authenticate } from "../middleware/auth.js";
import { mongoIdValidation, validate } from "../middleware/validation.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getNotifications);
router.get("/unread/count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.delete("/read-all", deleteAllRead);

router
  .route("/:id")
  .delete(mongoIdValidation("id"), validate, deleteNotification);

router.route("/:id/read").put(mongoIdValidation("id"), validate, markAsRead);

export default router;
