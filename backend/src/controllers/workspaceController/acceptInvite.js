/**
 * Accept Invite Controller
 * @route POST /api/workspaces/:id/invites/:notificationId/accept
 * @access Private
 */

import { acceptWorkspaceInvite } from "../../services/workspaceService/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendOk } from "../../utils/responseHandler/index.js";

export const acceptInvite = asyncHandler(async (req, res) => {
  const workspace = await acceptWorkspaceInvite(
    req.params.id,
    req.params.notificationId,
    req.user._id
  );

  sendOk(res, "Invite accepted", { data: { workspace } });
});
