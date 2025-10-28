/**
 * Remove Project Member Controller
 * @desc    Remove member from project
 * @route   DELETE /api/projects/:id/members/:userId
 * @access  Private
 */

import { removeProjectMember as removeProjectMemberService } from "../../services/projectService/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const removeProjectMember = asyncHandler(async (req, res) => {
  await removeProjectMemberService(
    req.params.id,
    req.params.userId,
    req.user._id
  );

  sendSuccess(res, 200, "Member removed successfully");
});
