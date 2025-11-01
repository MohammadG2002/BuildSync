/**
 * Update Task Controller
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";
import Project from "../../models/Project/index.js";
import Workspace from "../../models/Workspace/index.js";

export const updateTask = async (req, res) => {
  try {
    const { title, description, assigneeIds, status, priority, dueDate, tags } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user can edit - creator, assigned user, or project member
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isAssigned =
      task.assignedTo && Array.isArray(task.assignedTo)
        ? task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
          )
        : false;

    // Check if user is a project member
    const project = await Project.findById(task.project);
    const isProjectMember = project?.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    // Workspace viewers are read-only even if assigned/member
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);

    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot update tasks",
      });
    }

    // Check if user can edit - project member or workspace owner/admin
    if (
      !isProjectMember &&
      !(roleInWorkspace === "owner" || roleInWorkspace === "admin")
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this task",
      });
    }

    const oldAssignedTo =
      task.assignedTo && Array.isArray(task.assignedTo)
        ? task.assignedTo.map((id) => id.toString())
        : [];
    const oldStatus = task.status;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assigneeIds !== undefined) {
      // Process assigneeIds - ensure it's an array
      if (Array.isArray(assigneeIds)) {
        task.assignedTo = assigneeIds;
      } else if (assigneeIds) {
        task.assignedTo = [assigneeIds];
      } else {
        task.assignedTo = [];
      }
    }
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;

    await task.save();
    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Create notifications for newly assigned members
    if (assigneeIds !== undefined) {
      const newAssignedTo = task.assignedTo.map((id) => id._id.toString());
      const newlyAssigned = newAssignedTo.filter(
        (userId) => !oldAssignedTo.includes(userId)
      );

      const notificationPromises = newlyAssigned
        .filter((userId) => userId !== req.user._id.toString())
        .map((userId) =>
          Notification.create({
            recipient: userId,
            sender: req.user._id,
            type: "task_assigned",
            title: "New task assigned",
            message: `You have been assigned to "${task.title}"`,
            link: `/tasks/${task._id}`,
            metadata: {
              taskId: task._id,
              projectId: task.project,
              workspaceId: task.workspace,
            },
          })
        );

      await Promise.all(notificationPromises);
    }

    // Notify about status changes
    if (status && status !== oldStatus) {
      const notifyUsers = [task.createdBy._id.toString()];
      task.assignedTo.forEach((user) => {
        const userId = user._id.toString();
        if (userId !== req.user._id.toString()) {
          notifyUsers.push(userId);
        }
      });

      const uniqueUsers = [...new Set(notifyUsers)];

      for (const userId of uniqueUsers) {
        if (userId !== req.user._id.toString()) {
          await Notification.create({
            recipient: userId,
            sender: req.user._id,
            type: "task_updated",
            title: "Task status updated",
            message: `Status of "${task.title}" changed to ${status}`,
            link: `/tasks/${task._id}`,
            metadata: {
              taskId: task._id,
              projectId: task.project._id || task.project,
              workspaceId: task.workspace._id || task.workspace,
            },
          });
        }
      }
    }

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};
