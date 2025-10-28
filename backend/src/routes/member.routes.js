import express from "express";
import {
  searchUsers,
  getWorkspaceMembers,
  getProjectMembers,
  updateWorkspaceMemberRole,
} from "../controllers/memberController/index.js";
import {
  authenticate,
  mongoIdValidation,
  validate,
} from "../middleware/index.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get("/search", searchUsers);

router
  .route("/workspace/:workspaceId")
  .get(mongoIdValidation("workspaceId"), validate, getWorkspaceMembers);

router
  .route("/workspace/:workspaceId/:userId")
  .put(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("userId"),
    validate,
    updateWorkspaceMemberRole
  );

router
  .route("/project/:projectId")
  .get(mongoIdValidation("projectId"), validate, getProjectMembers);

export default router;
