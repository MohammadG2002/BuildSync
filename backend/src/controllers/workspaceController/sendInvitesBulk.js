/**
 * Send Bulk Invites Controller
 * @route POST /api/workspaces/:id/invites/bulk
 * Body: { invites: [ { userId?, email?, role? }, ... ] }
 */

import { createWorkspaceInvitesBulk } from "../../services/workspaceService/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";

export const sendInvitesBulk = asyncHandler(async (req, res) => {
  const { invites } = req.body || {};
  const result = await createWorkspaceInvitesBulk(
    req.params.id,
    invites,
    req.user._id
  );
  sendCreated(res, "Bulk invites processed", result);
});
