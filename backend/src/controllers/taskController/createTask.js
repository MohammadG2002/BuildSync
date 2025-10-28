/**
 * Create Task Controller
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";
import Notification from "../../models/Notification/index.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      workspace,
      assignedTo,
      status,
      priority,
      dueDate,
      tags,
    } = req.body;

    // Verify project exists if provided
    if (project) {
      const projectDoc = await Project.findById(project);
      if (!projectDoc) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    // Verify workspace exists
    const workspaceDoc = await Workspace.findById(workspace);
    if (!workspaceDoc) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (!workspaceDoc.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this workspace",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      workspace,
      assignedTo: assignedTo || req.user._id,
      createdBy: req.user._id,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      tags: tags || [],
    });

    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Create notification if assigned to someone else
    if (assignedTo && assignedTo !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignedTo,
        sender: req.user._id,
        type: "task_assigned",
        title: "New task assigned",
        message: `You have been assigned to "${title}"`,
        link: `/tasks/${task._id}`,
        metadata: {
          taskId: task._id,
          projectId: project,
          workspaceId: workspace,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};
