/**
 * Send Invite Controller
 * @route POST /api/workspaces/:id/invites
 * @access Private
 */

import { createWorkspaceInvite } from "../../services/workspaceService/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";

export const sendInvite = asyncHandler(async (req, res) => {
  const notification = await createWorkspaceInvite(
    req.params.id,
    req.body,
    req.user._id
  );

  sendCreated(res, "Invite sent", { data: { notification } });
});
