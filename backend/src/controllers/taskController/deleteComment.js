/**
 * Delete Comment Controller
 * @desc    Remove a specific comment from a task (with attachments cleanup)
 * @route   DELETE /api/tasks/:id/comments/:commentId
 * @access  Private (author, owner, or admin)
 */

import mongoose from "mongoose";
import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";
import path from "path";
import fs from "fs";

export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id) || null;
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot delete comments",
      });
    }

    const commentsArr = Array.isArray(task.comments) ? task.comments : [];
    const target = commentsArr.find((c) => c?._id?.toString() === commentId);
    if (!target) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    const isAuthor = target.user?.toString() === req.user._id.toString();
    const canModerate = ["owner", "admin"].includes(roleInWorkspace);
    if (!isAuthor && !canModerate) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to delete this comment",
      });
    }

    // Best-effort: remove files for comment-level attachments from disk
    try {
      const atts = Array.isArray(target.attachments) ? target.attachments : [];
      for (const att of atts) {
        try {
          const cleanUrl = (att.url || "").split("?")[0];
          const nameFromUrl = cleanUrl ? path.basename(cleanUrl) : undefined;
          const fileNameFromField = att.filename || undefined;
          const storedFileName = nameFromUrl || fileNameFromField;
          if (storedFileName) {
            const filePath = path.join(
              process.cwd(),
              "uploads",
              "attachments",
              storedFileName
            );
            if (fs.existsSync(filePath)) {
              fs.unlink(filePath, (err) => {
                if (err) {
                  console.warn(
                    "Failed to unlink comment attachment file:",
                    err.message
                  );
                }
              });
            }
          }
        } catch (e) {
          console.warn("Comment attachment cleanup error:", e.message);
        }
      }
    } catch (_) {}

    await Task.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $pull: { comments: { _id: new mongoose.Types.ObjectId(commentId) } } }
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
        type: "comment_deleted",
        meta: { commentId },
      });
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete comment" });
  }
};
