import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  addAttachment,
  addCommentAttachment,
} from "../controllers/taskController/index.js";
import {
  authenticate,
  taskValidation,
  taskCreateValidation,
  validate,
  mongoIdValidation,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Task CRUD routes
router
  .route("/")
  .get(getTasks)
  .post(taskCreateValidation, validate, createTask);

router
  .route("/:id")
  .get(mongoIdValidation("id"), validate, getTask)
  .put(mongoIdValidation("id"), taskValidation, validate, updateTask)
  .delete(mongoIdValidation("id"), validate, deleteTask);

// Task actions routes
router
  .route("/:id/comments")
  .post(mongoIdValidation("id"), validate, addComment);

router
  .route("/:id/attachments")
  .post(mongoIdValidation("id"), validate, addAttachment);

router
  .route("/:id/comments/:commentId/attachments")
  .post(
    mongoIdValidation("id"),
    mongoIdValidation("commentId"),
    validate,
    addCommentAttachment
  );

export default router;
