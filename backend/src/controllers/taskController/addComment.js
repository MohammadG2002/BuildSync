/**
 * Add Comment Controller
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Notification from "../../models/Notification/index.js";
import mongoose from "mongoose";
import Workspace from "../../models/Workspace/index.js";

export const addComment = async (req, res) => {
  try {
    const { text, content } = req.body;
    const commentText = text ?? content ?? "";
    // Allow empty comment text to support attachment-only comments

    // Removed validation for empty comment text

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Workspace viewers cannot add comments
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot add comments",
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

    // Fetch updated task with populated fields (ensure attachments and relations are populated too)
    const updatedTask = await Task.findById(req.params.id).populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    // Create notification for task creator and all assigned users
    const idToString = (val) => {
      if (!val) return null;
      if (typeof val === "string") return val;
      if (val._id) return val._id.toString();
      try {
        return val.toString();
      } catch {
        return null;
      }
    };

    const createdById = idToString(updatedTask.createdBy);
    const notifyUserIds = new Set(createdById ? [createdById] : []);

    // Add all assigned users to notification list
    if (updatedTask.assignedTo && Array.isArray(updatedTask.assignedTo)) {
      updatedTask.assignedTo.forEach((u) => {
        const uid = idToString(u);
        if (uid) notifyUserIds.add(uid);
      });
    }

    // Remove current user from notifications
    notifyUserIds.delete(idToString(req.user._id));

    // Create notifications in parallel, do not fail comment on notification errors
    try {
      const notificationPromises = Array.from(notifyUserIds).map((userIdStr) =>
        Notification.create({
          recipient: new mongoose.Types.ObjectId(userIdStr),
          sender: req.user._id,
          type: "comment_added",
          title: "New comment on task",
          message: `${req.user.name} commented on "${updatedTask.title}"`,
          link: `/tasks/${updatedTask._id}`,
          metadata: {
            taskId: updatedTask._id,
            projectId:
              updatedTask.project?._id ||
              new mongoose.Types.ObjectId(idToString(updatedTask.project)),
            workspaceId:
              updatedTask.workspace?._id ||
              new mongoose.Types.ObjectId(idToString(updatedTask.workspace)),
          },
        })
      );
      await Promise.all(notificationPromises);
    } catch (e) {
      // Log and continue; notifications should not block adding comments
      console.warn(
        "Comment added, but failed to create some notifications:",
        e
      );
    }

    // Log activity: comment added (non-blocking)
    try {
      const TaskActivity = (await import("../../models/TaskActivity/index.js"))
        .default;
      await TaskActivity.create({
        task: updatedTask._id,
        project: updatedTask.project,
        workspace: updatedTask.workspace,
        actor: req.user._id,
        type: "comment_added",
        meta: { hasText: commentText.trim().length > 0 },
      });
    } catch (e) {
      // no-op
    }

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
