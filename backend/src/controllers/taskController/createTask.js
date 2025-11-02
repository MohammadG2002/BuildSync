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
import TaskActivity from "../../models/TaskActivity/index.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project,
      workspace,
      assigneeIds,
      status,
      priority,
      dueDate,
      tags,
    } = req.body;

    // Verify project exists if provided
    let projectDoc = null;
    if (project) {
      projectDoc = await Project.findById(project);
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

    // Viewers are read-only at the workspace level
    const roleInWorkspace = workspaceDoc.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot create tasks",
      });
    }

    // Process assigneeIds - ensure it's an array
    let assignedToArray = [];
    if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
      assignedToArray = assigneeIds;
    } else if (assigneeIds && !Array.isArray(assigneeIds)) {
      // Handle single assignee for backwards compatibility
      assignedToArray = [assigneeIds];
    }

    // If part of a project, atomically increment the project's taskCounter to get a per-project sequence
    let sequence = null;
    if (projectDoc) {
      const updatedProject = await Project.findByIdAndUpdate(
        projectDoc._id,
        { $inc: { taskCounter: 1 } },
        { new: true }
      );
      sequence = updatedProject.taskCounter;
    }

    const task = await Task.create({
      title,
      description,
      project,
      workspace,
      assignedTo: assignedToArray,
      createdBy: req.user._id,
      status: status || "todo",
      priority: priority || "medium",
      dueDate,
      tags: tags || [],
      sequence,
    });

    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Log activity: task created
    try {
      await TaskActivity.create({
        task: task._id,
        project: task.project,
        workspace: task.workspace,
        actor: req.user._id,
        type: "created",
        meta: { title: task.title },
      });
    } catch (e) {
      // Non-blocking
      console.warn("Failed to log task creation activity", e?.message);
    }

    // Create notifications for all assigned members (except the creator)
    if (assignedToArray.length > 0) {
      const notificationPromises = assignedToArray
        .filter((userId) => userId !== req.user._id.toString())
        .map((userId) =>
          Notification.create({
            recipient: userId,
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
          })
        );

      await Promise.all(notificationPromises);
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
