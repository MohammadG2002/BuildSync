/**
 * Transfer Ownership Controller
 * @desc    Transfer workspace ownership to a member
 * @route   POST /api/workspaces/:id/transfer-ownership
 * @access  Private (Owner)
 */

import { transferWorkspaceOwnership } from "../../services/workspaceService/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";

export const transferOwnership = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newOwnerId } = req.body || {};

  const updated = await transferWorkspaceOwnership(
    id,
    newOwnerId,
    req.user._id
  );

  sendSuccess(res, 200, "Ownership transferred successfully", {
    workspace: updated,
  });
});
