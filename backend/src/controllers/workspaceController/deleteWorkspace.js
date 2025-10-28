/**
 * Delete Workspace Controller
 * @desc    Delete workspace
 * @route   DELETE /api/workspaces/:id
 * @access  Private
 */

import { deleteWorkspace as deleteWorkspaceService } from "../../services/workspaceService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const deleteWorkspace = asyncHandler(async (req, res) => {
  await deleteWorkspaceService(req.params.id, req.user._id);

  sendSuccess(res, 200, "Workspace deleted successfully");
});
