import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from "../controllers/projectController/index.js";
import {
  authenticate,
  projectValidation,
  validate,
  mongoIdValidation,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Project CRUD routes
router
  .route("/")
  .get(getProjects)
  .post(projectValidation, validate, createProject);

router
  .route("/:id")
  .get(mongoIdValidation("id"), validate, getProject)
  .put(mongoIdValidation("id"), projectValidation, validate, updateProject)
  .delete(mongoIdValidation("id"), validate, deleteProject);

// Member management routes
router
  .route("/:id/members")
  .post(mongoIdValidation("id"), validate, addProjectMember);

router
  .route("/:id/members/:userId")
  .delete(
    mongoIdValidation("id"),
    mongoIdValidation("userId"),
    validate,
    removeProjectMember
  );

export default router;
