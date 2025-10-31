/**
 * Get Tasks Controller
 * @desc    Get all tasks
 * @route   GET /api/tasks?project=projectId&workspace=workspaceId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";

export const getTasks = async (req, res) => {
  try {
    const { project, workspace, status, priority, assignedTo } = req.query;
    const userId = req.user._id;

    // Build base query
    const query = {};

    // If project is specified, check if user is a member of that project
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      // Check if user is a member of the project
      const isMember = projectDoc.members.some(
        (member) => member.user.toString() === userId.toString()
      );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not a member of this project",
        });
      }

      query.project = project;
    } else if (workspace) {
      // If only workspace is specified, check workspace membership
      const workspaceDoc = await Workspace.findById(workspace);
      if (!workspaceDoc) {
        return res.status(404).json({
          success: false,
          message: "Workspace not found",
        });
      }

      // Check if user is a member of the workspace
      const isMember =
        workspaceDoc.owner.toString() === userId.toString() ||
        workspaceDoc.members.some(
          (member) => member.user.toString() === userId.toString()
        );

      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "Access denied: You are not a member of this workspace",
        });
      }

      query.workspace = workspace;
    } else {
      // If neither project nor workspace specified, only show user's tasks
      query.$or = [{ assignedTo: userId }, { createdBy: userId }];
    }

    // Add additional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
      .populate("comments.user", "name email avatar")
      .populate("attachments.uploadedBy", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};
