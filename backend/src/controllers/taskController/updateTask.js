/**
 * Update Task Controller
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";

export const updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, priority, dueDate, tags } =
      req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user can edit
    const canEdit =
      task.createdBy.toString() === req.user._id.toString() ||
      task.assignedTo?.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this task",
      });
    }

    const oldAssignedTo = task.assignedTo?.toString();
    const oldStatus = task.status;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (tags) task.tags = tags;

    await task.save();
    await task.populate("assignedTo", "name email avatar");
    await task.populate("createdBy", "name email avatar");
    await task.populate("project", "name color");
    await task.populate("workspace", "name");

    // Create notifications for changes
    if (
      assignedTo &&
      assignedTo !== oldAssignedTo &&
      assignedTo !== req.user._id.toString()
    ) {
      await Notification.create({
        recipient: assignedTo,
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
      });
    }

    if (status && status !== oldStatus) {
      const notifyUsers = [task.createdBy.toString()];
      if (
        task.assignedTo &&
        task.assignedTo.toString() !== req.user._id.toString()
      ) {
        notifyUsers.push(task.assignedTo.toString());
      }

      for (const userId of notifyUsers) {
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
              projectId: task.project,
              workspaceId: task.workspace,
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
