/**
 * Add Member Controller
 * @desc    Add member to workspace
 * @route   POST /api/workspaces/:id/members
 * @access  Private
 */

import { addWorkspaceMember } from "../../services/workspaceService/index.js";
import { sendCreated } from "../../utils/responseHandler/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";

export const addMember = asyncHandler(async (req, res) => {
  const workspace = await addWorkspaceMember(
    req.params.id,
    req.body,
    req.user._id
  );

  sendCreated(res, "Member added successfully", { data: { workspace } });
});
