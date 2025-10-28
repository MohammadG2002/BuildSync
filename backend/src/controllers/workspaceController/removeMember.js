/**
 * Remove Member Controller
 * @desc    Remove member from workspace
 * @route   DELETE /api/workspaces/:id/members/:userId
 * @access  Private
 */

import { removeWorkspaceMember } from "../../services/workspaceService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const removeMember = asyncHandler(async (req, res) => {
  await removeWorkspaceMember(req.params.id, req.params.userId, req.user._id);

  sendSuccess(res, 200, "Member removed successfully");
});
