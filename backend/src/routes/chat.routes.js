import express from "express";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
} from "../controllers/chatController/index.js";
import {
  authenticate,
  mongoIdValidation,
  validate,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router
  .route("/:workspaceId")
  .get(mongoIdValidation("workspaceId"), validate, getMessages)
  .post(mongoIdValidation("workspaceId"), validate, sendMessage);

router
  .route("/:workspaceId/:messageId")
  .put(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    updateMessage
  )
  .delete(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    deleteMessage
  );

router
  .route("/:workspaceId/:messageId/read")
  .put(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    markAsRead
  );

export default router;
