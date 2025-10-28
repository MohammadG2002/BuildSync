/**
 * Create Project Controller
 * @desc    Create new project
 * @route   POST /api/projects
 * @access  Private
 */

import { createProject as createProjectService } from "../../services/projectService/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService(req.body, req.user._id);

  sendCreated(res, "Project created successfully", { data: { project } });
});
