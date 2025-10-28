/**
 * Update Project Controller
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */

import { updateProject as updateProjectService } from "../../services/projectService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const updateProject = asyncHandler(async (req, res) => {
  const project = await updateProjectService(
    req.params.id,
    req.body,
    req.user._id
  );

  sendSuccess(res, 200, "Project updated successfully", {
    data: { project },
  });
});
