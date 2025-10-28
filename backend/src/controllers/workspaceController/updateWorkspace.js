/**
 * Update Workspace Controller
 * @desc    Update workspace
 * @route   PUT /api/workspaces/:id
 * @access  Private
 */

import { updateWorkspace as updateWorkspaceService } from "../../services/workspaceService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const updateWorkspace = asyncHandler(async (req, res) => {
  const workspace = await updateWorkspaceService(
    req.params.id,
    req.body,
    req.user._id
  );

  sendSuccess(res, 200, "Workspace updated successfully", {
    data: { workspace },
  });
});
