/**
 * Add Project Member Controller
 * @desc    Add member to project
 * @route   POST /api/projects/:id/members
 * @access  Private
 */

import { addProjectMember as addProjectMemberService } from "../../services/projectService/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const addProjectMember = asyncHandler(async (req, res) => {
  const project = await addProjectMemberService(
    req.params.id,
    req.body,
    req.user._id
  );

  sendCreated(res, "Member added successfully", { data: { project } });
});
