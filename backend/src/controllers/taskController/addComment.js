/**
 * Add Comment Controller
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";

export const addComment = async (req, res) => {
  try {
    const { text, content } = req.body;
    const commentText = text || content;

    if (!commentText || commentText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.comments.push({
      user: req.user._id,
      content: commentText,
    });

    await task.save();
    await task.populate("comments.user", "name email avatar");

    // Create notification for task creator and assignee
    const notifyUsers = [task.createdBy.toString()];
    if (
      task.assignedTo &&
      task.assignedTo.toString() !== task.createdBy.toString()
    ) {
      notifyUsers.push(task.assignedTo.toString());
    }

    for (const userId of notifyUsers) {
      if (userId !== req.user._id.toString()) {
        await Notification.create({
          recipient: userId,
          sender: req.user._id,
          type: "comment_added",
          title: "New comment on task",
          message: `${req.user.name} commented on "${task.title}"`,
          link: `/tasks/${task._id}`,
          metadata: {
            taskId: task._id,
            projectId: task.project,
            workspaceId: task.workspace,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
