/**
 * Add Comment Controller
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";
import mongoose from "mongoose";

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

    // Create new comment object
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      user: req.user._id,
      content: commentText,
      attachments: [],
      createdAt: new Date(),
    };

    // Use raw MongoDB to bypass Mongoose validation on existing comments
    await mongoose.connection.db
      .collection("tasks")
      .updateOne(
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { $push: { comments: newComment } }
      );

    // Fetch updated task with populated fields
    const updatedTask = await Task.findById(req.params.id).populate(
      "comments.user",
      "name email avatar"
    );

    // Create notification for task creator and all assigned users
    const notifyUserIds = new Set([updatedTask.createdBy.toString()]);

    // Add all assigned users to notification list
    if (updatedTask.assignedTo && Array.isArray(updatedTask.assignedTo)) {
      updatedTask.assignedTo.forEach((userId) => {
        notifyUserIds.add(userId.toString());
      });
    }

    // Remove current user from notifications
    notifyUserIds.delete(req.user._id.toString());

    // Create notifications in parallel
    const notificationPromises = Array.from(notifyUserIds).map((userId) =>
      Notification.create({
        recipient: userId,
        sender: req.user._id,
        type: "comment_added",
        title: "New comment on task",
        message: `${req.user.name} commented on "${updatedTask.title}"`,
        link: `/tasks/${updatedTask._id}`,
        metadata: {
          taskId: updatedTask._id,
          projectId: updatedTask.project,
          workspaceId: updatedTask.workspace,
        },
      })
    );

    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
    });
  }
};
