/**
 * React To Comment Controller
 * @desc    Like, dislike, or clear reaction on a comment
 * @route   PATCH /api/tasks/:id/comments/:commentId/react
 * @access  Private (workspace members; viewers allowed)
 */

import mongoose from "mongoose";
import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const reactToComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { action } = req.body || {};
    const userId = req.user._id;

    if (!["like", "dislike", "clear"].includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reaction action" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ensure user belongs to workspace (viewers allowed to react)
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id) || null;
    if (!roleInWorkspace && String(task.createdBy) !== String(userId)) {
      return res
        .status(403)
        .json({ success: false, message: "Not a workspace member" });
    }

    const tId = new mongoose.Types.ObjectId(id);
    const cId = new mongoose.Types.ObjectId(commentId);
    const uId = new mongoose.Types.ObjectId(userId);

    // First clear opposite reaction and optionally same reaction depending on action
    if (action === "like") {
      await Task.updateOne(
        { _id: tId, "comments._id": cId },
        {
          $pull: { "comments.$.dislikes": uId },
          $addToSet: { "comments.$.likes": uId },
        }
      );
    } else if (action === "dislike") {
      await Task.updateOne(
        { _id: tId, "comments._id": cId },
        {
          $pull: { "comments.$.likes": uId },
          $addToSet: { "comments.$.dislikes": uId },
        }
      );
    } else if (action === "clear") {
      await Task.updateOne(
        { _id: tId, "comments._id": cId },
        { $pull: { "comments.$.likes": uId, "comments.$.dislikes": uId } }
      );
    }

    const updatedTask = await Task.findById(id).populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
      { path: "testAttachments.uploadedBy", select: "name email avatar" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Reaction updated",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("React to comment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to react to comment" });
  }
};
