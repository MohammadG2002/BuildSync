/**
 * Get Workspace Controller
 * @desc    Get single workspace
 * @route   GET /api/workspaces/:id
 * @access  Private
 */

import { getWorkspaceById } from "../../services/workspaceService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await getWorkspaceById(req.params.id, req.user._id);

  sendSuccess(res, 200, "Workspace fetched successfully", {
    data: { workspace },
  });
});
