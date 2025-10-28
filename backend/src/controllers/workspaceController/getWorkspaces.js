/**
 * Get Workspaces Controller
 * @desc    Get all workspaces for user
 * @route   GET /api/workspaces
 * @access  Private
 */

import { getUserWorkspaces } from "../../services/workspaceService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await getUserWorkspaces(req.user._id);

  sendSuccess(res, 200, "Workspaces fetched successfully", {
    count: workspaces.length,
    data: { workspaces },
  });
});
