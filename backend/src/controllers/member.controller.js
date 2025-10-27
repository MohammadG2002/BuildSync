import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";

// @desc    Search users (for inviting to workspace/project)
// @route   GET /api/members/search?q=query
// @access  Private
export const searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
      _id: { $ne: req.user._id }, // Exclude current user
      isActive: true,
    })
      .select("name email avatar")
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: users.length,
      data: { users },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search users",
    });
  }
};

// @desc    Get workspace members
// @route   GET /api/members/workspace/:workspaceId
// @access  Private
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

// @desc    Get project members
// @route   GET /api/members/project/:projectId
// @access  Private
export const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar lastLogin");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if user has access
    const isOwner = project.owner._id.toString() === req.user._id.toString();
    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString()
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      count: project.members.length,
      data: { members: project.members },
    });
  } catch (error) {
    console.error("Get project members error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project members",
    });
  }
};

// @desc    Update member role in workspace
// @route   PUT /api/members/workspace/:workspaceId/:userId
// @access  Private
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
