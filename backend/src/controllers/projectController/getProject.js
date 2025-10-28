/**
 * Get Project Controller
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */

import { getProjectById } from "../../services/projectService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getProject = asyncHandler(async (req, res) => {
  const project = await getProjectById(req.params.id, req.user._id);

  sendSuccess(res, 200, "Project fetched successfully", {
    data: { project },
  });
});
