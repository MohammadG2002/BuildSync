/**
 * Delete Task Controller
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Viewers cannot delete tasks
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot delete tasks",
      });
    }

    const isWorkspaceAdminOrOwner =
      roleInWorkspace === "owner" || roleInWorkspace === "admin";

    // Allow delete if creator OR workspace admin/owner OR project member
    let canDelete = task.createdBy.toString() === req.user._id.toString();

    if (!canDelete) {
      // Check project membership
      const project = await (
        await import("../../models/Project/index.js")
      ).default.findById(task.project);
      const isProjectMember = project?.members?.some(
        (m) => m.user.toString() === req.user._id.toString()
      );
      canDelete = Boolean(isWorkspaceAdminOrOwner || isProjectMember);
    }

    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this task",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};
