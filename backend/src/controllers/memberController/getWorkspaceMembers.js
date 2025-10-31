/**
 * Get Workspace Members Controller
 * @desc    Get workspace members
 * @route   GET /api/members/workspace/:workspaceId
 * @access  Private
 */

import Workspace from "../../models/Workspace/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";

export const getWorkspaceMembers = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const workspace = await Workspace.findById(workspaceId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar lastLogin");

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user is member (compare with _id before population)
  const userId = req.user._id.toString();
  const isMemberCheck =
    workspace.owner._id.toString() === userId ||
    workspace.members.some((m) => m.user._id.toString() === userId);

  if (!isMemberCheck) {
    throw new Error("Access denied");
  }

  // Transform members data to flat structure
  const members = workspace.members.map((member) => ({
    id: member.user._id.toString(),
    name: member.user.name,
    email: member.user.email,
    avatar: member.user.avatar,
    role: member.role,
    joinedDate: member.joinedAt,
    lastLogin: member.user.lastLogin,
  }));

  sendSuccess(res, 200, "Members fetched successfully", {
    count: members.length,
    data: { members },
  });
});
