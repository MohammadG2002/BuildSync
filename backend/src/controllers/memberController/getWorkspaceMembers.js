/**
 * Get Workspace Members Controller
 * @desc    Get workspace members
 * @route   GET /api/members/workspace/:workspaceId
 * @access  Private
 */

import Workspace from "../../models/Workspace/index.js";

export const getWorkspaceMembers = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar lastLogin");

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is member
    if (!workspace.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      count: workspace.members.length,
      data: { members: workspace.members },
    });
  } catch (error) {
    console.error("Get workspace members error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workspace members",
    });
  }
};
