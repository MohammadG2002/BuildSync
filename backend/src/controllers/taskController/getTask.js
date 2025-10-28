/**
 * Get Task Controller
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name color")
      .populate("workspace", "name")
      .populate("comments.user", "name email avatar");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access
    const hasAccess =
      task.assignedTo?._id.toString() === req.user._id.toString() ||
      task.createdBy._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
};
