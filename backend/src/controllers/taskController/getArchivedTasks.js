/**
 * Get Archived Tasks Controller
 * @desc    Get archived tasks scoped by workspace
 * @route   GET /api/tasks/archived?workspace=workspaceId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";

export const getArchivedTasks = async (req, res) => {
  try {
    const { workspace } = req.query;
    const userId = req.user._id;

    if (!workspace) {
      return res.status(400).json({
        success: false,
        message: "workspace query parameter is required",
      });
    }

    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const role = workspaceDoc.getUserRole?.(userId) || null;
    const isWorkspaceMember = Boolean(role);
    if (!isWorkspaceMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You are not a member of this workspace",
      });
    }

    const query = { isArchived: true };

    if (role === "owner" || role === "admin") {
      query.workspace = workspace;
    } else {
      // Restrict to archived tasks in projects where user is a member
      const memberProjects = await Project.find({
        workspace,
        "members.user": userId,
      }).select("_id");
      const ids = memberProjects.map((p) => p._id);
      query.project = { $in: ids };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks },
    });
  } catch (error) {
    console.error("Get archived tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch archived tasks",
    });
  }
};
