/**
 * Update Workspace Member Role Controller
 * @desc    Update member role in workspace
 * @route   PUT /api/members/workspace/:workspaceId/:userId
 * @access  Private
 */

import Workspace from "../../models/Workspace/index.js";

export const updateWorkspaceMemberRole = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;

    if (!role || !["member", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role is required (member or admin)",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if current user is owner or admin
    const userRole = workspace.getUserRole(req.user._id);
    if (!["owner", "admin"].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owners and admins can update member roles",
      });
    }

    // Find member and update role
    const member = workspace.members.find((m) => m.user.toString() === userId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found in workspace",
      });
    }

    // Cannot change owner role
    if (workspace.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot change owner role",
      });
    }

    member.role = role;
    await workspace.save();

    res.json({
      success: true,
      message: "Member role updated successfully",
    });
  } catch (error) {
    console.error("Update member role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update member role",
    });
  }
};
