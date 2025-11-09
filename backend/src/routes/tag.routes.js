import express from "express";
import {
  authenticate,
  validate,
  createTagValidation,
  updateTagValidation,
  mongoIdValidation,
} from "../middleware/index.js";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagController/index.js";

const router = express.Router();

// Require auth for all tag routes
router.use(authenticate);

router.route("/").get(getTags).post(createTagValidation, validate, createTag);

router
  .route("/:id")
  .put(updateTagValidation, validate, updateTag)
  .delete(mongoIdValidation("id"), validate, deleteTag);

export default router;
