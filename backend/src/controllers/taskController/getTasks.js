/**
 * Get Tasks Controller
 * @desc    Get all tasks
 * @route   GET /api/tasks?project=projectId&workspace=workspaceId
 * @access  Private
 */

import Task from "../../models/Task/index.js";

export const getTasks = async (req, res) => {
  try {
    const { project, workspace, status, priority, assignedTo } = req.query;

    // Build query
    const query = {
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }],
    };

    if (project) query.project = project;
    if (workspace) query.workspace = workspace;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
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
