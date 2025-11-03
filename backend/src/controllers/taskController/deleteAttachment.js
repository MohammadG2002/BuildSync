/**
 * Delete Attachment Controller
 * @desc    Remove an attachment from a task by attachment ID
 * @route   DELETE /api/tasks/:id/attachments/:attachmentId
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";
import path from "path";
import fs from "fs";

export const deleteAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    const { section } = req.query || {};
    const targetArray = section === "test" ? "testAttachments" : "attachments";

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Viewers cannot delete attachments
    const workspaceDoc = await Workspace.findById(task.workspace);
    // Be defensive in case req.user is missing (should be set by auth middleware)
    let roleInWorkspace = null;
    if (workspaceDoc && req.user && req.user._id) {
      try {
        roleInWorkspace = workspaceDoc.getUserRole(req.user._id);
      } catch (_) {
        // ignore role resolution errors and continue as non-viewer
      }
    }
    if (roleInWorkspace === "viewer") {
      return res.status(403).json({
        success: false,
        message: "Viewers cannot delete attachments",
      });
    }

    // Try to locate the attachment subdocument by id, with a robust fallback
    const collection = Array.isArray(task[targetArray])
      ? task[targetArray]
      : [];
    let attachment = collection.id ? collection.id(attachmentId) : null;
    if (!attachment) {
      // Fallback: manual search by string comparison in case of ObjectId quirks
      const idx = collection.findIndex(
        (att) => att._id?.toString() === attachmentId.toString()
      );
      if (idx !== -1) {
        attachment = collection[idx];
      }
    }

    if (!attachment) {
      return res
        .status(404)
        .json({ success: false, message: "Attachment not found" });
    }

    // Attempt to remove file from disk if we can safely derive the stored filename
    try {
      const cleanUrl = (attachment.url || "").split("?")[0];
      const nameFromUrl = cleanUrl ? path.basename(cleanUrl) : undefined;
      const fileNameFromField = attachment.filename || undefined;
      const storedFileName = nameFromUrl || fileNameFromField;
      if (storedFileName) {
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "attachments",
          storedFileName
        );
        if (fs.existsSync(filePath)) {
          // Unlink asynchronously without blocking response
          fs.unlink(filePath, (err) => {
            if (err) {
              console.warn("Failed to unlink attachment file:", err.message);
            }
          });
        }
      }
    } catch (unlinkErr) {
      // Do not fail the request if filesystem cleanup fails
      console.warn("Attachment filesystem cleanup error:", unlinkErr.message);
    }

    // Use a direct MongoDB update to pull the attachment subdocument
    const pullResult = await Task.updateOne(
      { _id: task._id },
      { $pull: { [targetArray]: { _id: attachment._id } } }
    );

    if (!pullResult || pullResult.modifiedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Attachment not found" });
    }

    // Get the updated task populated for consistent client shape
    let updatedTask = null;
    try {
      updatedTask = await Task.findById(task._id).populate([
        { path: "assignedTo", select: "name email avatar" },
        { path: "createdBy", select: "name email avatar" },
        { path: "project", select: "name" },
        { path: "workspace", select: "name" },
        { path: "comments.user", select: "name email avatar" },
        { path: "attachments.uploadedBy", select: "name email avatar" },
        { path: "testAttachments.uploadedBy", select: "name email avatar" },
      ]);
    } catch (populateErr) {
      console.warn("Task populate after delete failed:", populateErr.message);
    }

    return res.status(200).json({
      success: true,
      message: "Attachment deleted successfully",
      data: { task: updatedTask || (await Task.findById(task._id)) || task },
    });
  } catch (error) {
    console.error("Delete attachment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete attachment" });
  }
};
