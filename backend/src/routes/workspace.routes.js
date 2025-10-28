import express from "express";
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
} from "../controllers/workspaceController/index.js";
import {
  authenticate,
  checkWorkspaceMembership,
  workspaceValidation,
  validate,
  mongoIdValidation,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Workspace CRUD routes
router
  .route("/")
  .get(getWorkspaces)
  .post(workspaceValidation, validate, createWorkspace);

router
  .route("/:id")
  .get(mongoIdValidation("id"), validate, getWorkspace)
  .put(mongoIdValidation("id"), workspaceValidation, validate, updateWorkspace)
  .delete(mongoIdValidation("id"), validate, deleteWorkspace);

// Member management routes
router.route("/:id/members").post(mongoIdValidation("id"), validate, addMember);

router
  .route("/:id/members/:userId")
  .delete(
    mongoIdValidation("id"),
    mongoIdValidation("userId"),
    validate,
    removeMember
  );

export default router;
