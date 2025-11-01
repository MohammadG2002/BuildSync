/**
 * Delete Attachment Controller
 * @desc    Remove an attachment from a task by attachment ID
 * @route   DELETE /api/tasks/:id/attachments/:attachmentId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";

export const deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Viewers cannot delete attachments
    const workspaceDoc = await Workspace.findById(task.workspace);
    const roleInWorkspace = workspaceDoc?.getUserRole(req.user._id);
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot delete attachments",
      });
    }

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res
        .status(404)
        .json({ success: false, message: "Attachment not found" });
    }

    // Remove the attachment subdocument (use deleteOne to avoid deprecated remove())
    if (typeof attachment.deleteOne === "function") {
      attachment.deleteOne();
    } else {
      // Fallback for environments where deleteOne isn't available
      task.attachments.pull({ _id: attachmentId });
    }

    await task.save();

    // Re-populate key relations for consistent client shape
    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Delete attachment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete attachment" });
  }
};
