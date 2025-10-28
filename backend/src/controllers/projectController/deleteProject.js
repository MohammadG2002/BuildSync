/**
 * Delete Project Controller
 * @desc    Delete/Archive project
 * @route   DELETE /api/projects/:id
 * @access  Private
 */

import { deleteProject as deleteProjectService } from "../../services/projectService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const deleteProject = asyncHandler(async (req, res) => {
  await deleteProjectService(req.params.id, req.user._id);

  sendSuccess(res, 200, "Project archived successfully");
});
