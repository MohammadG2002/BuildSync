import express from "express";
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  removeMember,
  sendInvite,
  sendInvitesBulk,
  acceptInvite,
  declineInvite,
  transferOwnership,
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

// Transfer ownership
router
  .route("/:id/transfer-ownership")
  .post(mongoIdValidation("id"), validate, transferOwnership);

// Invites
router
  .route("/:id/invites")
  .post(mongoIdValidation("id"), validate, sendInvite);

// Bulk invites (array of emails or userIds)
router
  .route(":id/invites/bulk")
  .post(mongoIdValidation("id"), validate, sendInvitesBulk);

router
  .route("/:id/invites/:notificationId/accept")
  .post(
    mongoIdValidation("id"),
    mongoIdValidation("notificationId"),
    validate,
    acceptInvite
  );

router
  .route("/:id/invites/:notificationId/decline")
  .post(
    mongoIdValidation("id"),
    mongoIdValidation("notificationId"),
    validate,
    declineInvite
  );

export default router;
