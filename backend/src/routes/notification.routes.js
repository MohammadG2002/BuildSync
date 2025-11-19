import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markManyAsRead,
  deleteNotification,
  deleteAllRead,
} from "../controllers/notificationController/index.js";
import {
  authenticate,
  mongoIdValidation,
  validate,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/", getNotifications);
router.get("/unread/count", getUnreadCount);
router.put("/read-all", markAllAsRead);
router.put("/read", markManyAsRead);
router.delete("/read-all", deleteAllRead);

router
  .route("/:id")
  .delete(mongoIdValidation("id"), validate, deleteNotification);

router.route("/:id/read").put(mongoIdValidation("id"), validate, markAsRead);

export default router;
