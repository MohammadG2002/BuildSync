/**
 * Delete Subtask Controller
 * @desc    Remove a subtask from a task
 * @route   DELETE /api/tasks/:id/subtasks/:subtaskId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const deleteSubtask = async (req, res) => {
  try {
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

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({
        success: false,
        message: "Subtask not found",
      });
    }

    subtask.deleteOne();
    await task.save();

    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    res.status(200).json({
      success: true,
      message: "Subtask deleted successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Delete subtask error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete subtask",
    });
  }
};
