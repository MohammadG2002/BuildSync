/**
 * Restore Task Controller
 * @desc    Restore an archived task
 * @route   PUT /api/tasks/:id/restore
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";
import TaskActivity from "../../models/TaskActivity/index.js";

export const restoreTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!task.isArchived) {
      return res.status(400).json({
        success: false,
        message: "Task is not archived",
      });
    }

    // Permission checks (mirror archive permission intent)
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole?.(req.user._id) ?? null;
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot restore tasks",
      });
    }

    const project = await Project.findById(task.project);
    const isProjectMember = Array.isArray(project?.members)
      ? project.members.some(
          (m) => m.user.toString() === req.user._id.toString()
        )
      : false;
    const isWorkspaceAdminOrOwner =
      roleInWorkspace === "owner" || roleInWorkspace === "admin";

    if (!isProjectMember && !isWorkspaceAdminOrOwner) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to restore this task",
      });
    }

    task.isArchived = false;
    await task.save();
    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Log activity (non-blocking)
    try {
      await TaskActivity.create({
        task: task._id,
        project: task.project._id || task.project,
        workspace: task.workspace._id || task.workspace,
        actor: req.user._id,
        type: "task_restored",
        meta: {},
      });
    } catch (e) {
      console.warn("Failed to log task restore activity", e?.message);
    }

    res.json({
      success: true,
      message: "Task restored successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Restore task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to restore task",
    });
  }
};
