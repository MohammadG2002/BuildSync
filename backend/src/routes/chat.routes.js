import express from "express";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getDirectMessages,
  sendDirectMessage,
  markDirectRead,
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

// Direct messages within a workspace
router
  .route("/:workspaceId/dm/:userId")
  .get(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("userId"),
    validate,
    getDirectMessages
  )
  .post(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("userId"),
    validate,
    sendDirectMessage
  );

// Global direct messages (not tied to a workspace)
router
  .route("/dm/:userId")
  .get(mongoIdValidation("userId"), validate, getDirectMessages)
  .post(mongoIdValidation("userId"), validate, sendDirectMessage);

// Mark global DM conversation as read
router.put(
  "/dm/:userId/read",
  mongoIdValidation("userId"),
  validate,
  markDirectRead
);

export default router;
