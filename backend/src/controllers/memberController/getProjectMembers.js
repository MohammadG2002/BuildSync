/**
 * Get Project Members Controller
 * @desc    Get project members
 * @route   GET /api/members/project/:projectId
 * @access  Private
 */

import Project from "../../models/Project/index.js";

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
