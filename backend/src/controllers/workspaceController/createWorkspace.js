/**
 * Create Workspace Controller
 * @desc    Create new workspace
 * @route   POST /api/workspaces
 * @access  Private
 */

import { createWorkspace as createWorkspaceService } from "../../services/workspaceService/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const createWorkspace = asyncHandler(async (req, res) => {
  const workspace = await createWorkspaceService(req.body, req.user._id);

  sendCreated(res, "Workspace created successfully", { data: { workspace } });
});
