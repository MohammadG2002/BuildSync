/**
 * Update Comment Controller
 * @desc    Edit an existing comment's content
 * @route   PATCH /api/tasks/:id/comments/:commentId
 * @access  Private (author only; viewers forbidden)
 */

import mongoose from "mongoose";
import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { content, text } = req.body || {};
    const nextContent = (content ?? text ?? "").toString();

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Workspace viewers cannot edit comments
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res
        .status(403)
        .json({ success: false, message: "Viewers cannot edit comments" });
    }

    // Validate comment exists and author matches current user
    const comment = (Array.isArray(task.comments) ? task.comments : []).find(
      (c) => c?._id?.toString() === commentId
    );
    if (!comment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
    }

    // Perform atomic update
    await Task.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        "comments._id": new mongoose.Types.ObjectId(commentId),
      },
      { $set: { "comments.$.content": nextContent } }
    );

    const updatedTask = await Task.findById(id).populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
      { path: "testAttachments.uploadedBy", select: "name email avatar" },
    ]);

    // Non-blocking activity log
    try {
      const TaskActivity = (await import("../../models/TaskActivity/index.js"))
        .default;
      await TaskActivity.create({
        task: updatedTask._id,
        project: updatedTask.project,
        workspace: updatedTask.workspace,
        actor: req.user._id,
        type: "comment_edited",
        meta: { commentId },
      });
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Update comment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update comment" });
  }
};
