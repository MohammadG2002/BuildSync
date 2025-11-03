/**
 * Add Attachment to Comment Controller
 * @desc    Add an attachment to a specific comment within a task
 * @route   POST /api/tasks/:id/comments/:commentId/attachments
 * @access  Private
 */

import mongoose from "mongoose";
import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const addCommentAttachment = async (req, res) => {
  try {
    const { id: taskId, commentId } = req.params;
    const { name, url, size, type, filename, originalName, mimetype } =
      req.body;

    if (!name && !filename && !originalName) {
      return res
        .status(400)
        .json({ success: false, message: "Attachment name is required" });
    }
    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Attachment URL is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Viewers cannot add attachments
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot add attachments",
      });
    }

    const tid = new mongoose.Types.ObjectId(taskId);
    const cid = new mongoose.Types.ObjectId(commentId);

    // Push attachment into the specific comment's attachments array using raw update
    const pushResult = await mongoose.connection.db
      .collection("tasks")
      .updateOne(
        { _id: tid, "comments._id": cid },
        {
          $push: {
            "comments.$.attachments": {
              name: name || originalName || filename,
              url,
              size: size ?? undefined,
              type: type || mimetype || undefined,
              uploadedBy: req.user._id,
              uploadedAt: new Date(),
            },
          },
        }
      );

    if (pushResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Return updated task populated (include attachments uploader population)
    const updatedTask = await Task.findById(taskId).populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    // Log activity: attachment added (non-blocking)
    try {
      const TaskActivity = (await import("../../models/TaskActivity/index.js"))
        .default;
      await TaskActivity.create({
        task: updatedTask._id,
        project: updatedTask.project,
        workspace: updatedTask.workspace,
        actor: req.user._id,
        type: "attachment_added",
        meta: { scope: "comment", commentId },
      });
    } catch (e) {
      // no-op
    }

    return res.status(201).json({
      success: true,
      message: "Attachment added to comment successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Add comment attachment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add attachment to comment",
    });
  }
};
