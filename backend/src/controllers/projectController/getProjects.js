/**
 * Get Projects Controller
 * @desc    Get all projects in workspace
 * @route   GET /api/projects?workspace=workspaceId
 * @access  Private
 */

import { getProjects as getProjectsService } from "../../services/projectService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await getProjectsService(req.query, req.user._id);

  sendSuccess(res, 200, "Projects fetched successfully", {
    count: projects.length,
    data: { projects },
  });
});
