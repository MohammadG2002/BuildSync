/**
 * Add Subtask Controller
 * @desc    Add a subtask to a task
 * @route   POST /api/tasks/:id/subtasks
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const addSubtask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Subtask title is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Viewers cannot modify tasks
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot modify subtasks",
      });
    }

    task.subtasks.push({ title: title.trim(), completed: !!completed });
    await task.save();

    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    res.status(201).json({
      success: true,
      message: "Subtask added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add subtask",
    });
  }
};
