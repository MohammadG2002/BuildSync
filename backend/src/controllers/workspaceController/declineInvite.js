/**
 * Decline Invite Controller
 * @route POST /api/workspaces/:id/invites/:notificationId/decline
 * @access Private
 */

import { declineWorkspaceInvite } from "../../services/workspaceService/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";

export const declineInvite = asyncHandler(async (req, res) => {
  await declineWorkspaceInvite(
    req.params.id,
    req.params.notificationId,
    req.user._id
  );

  sendSuccess(res, 200, "Invite declined");
});
