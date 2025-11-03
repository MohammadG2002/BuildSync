/**
 * Add Attachment Controller
 * @desc    Add attachment to task
 * @route   POST /api/tasks/:id/attachments
 * @access  Private
 */

import Task from "../../models/Task/index.js";
import Workspace from "../../models/Workspace/index.js";
import mongoose from "mongoose";

export const addAttachment = async (req, res) => {
  try {
    const { section } = req.query || {};
    const targetArray = section === "test" ? "testAttachments" : "attachments";
    const { name, url, size, type, filename, originalName, mimetype } =
      req.body || {};

    if (!url || (!name && !filename && !originalName)) {
      return res.status(400).json({
        success: false,
        message: "Attachment name and URL are required",
      });
    }

    const task = await Task.findById(req.params.id).select(
      "_id workspace project"
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
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

    // Use raw update to avoid validating existing comment docs with empty content
    const tid = new mongoose.Types.ObjectId(task._id);
    const pushResult = await mongoose.connection.db
      .collection("tasks")
      .updateOne(
        { _id: tid },
        {
          $push: {
            [targetArray]: {
              _id: new mongoose.Types.ObjectId(),
              filename: filename || name || originalName,
              originalName: originalName || name,
              mimetype: mimetype || type,
              url,
              size: size ?? undefined,
              uploadedBy: req.user._id,
              uploadedAt: new Date(),
            },
          },
        }
      );

    if (pushResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Return updated task populated
    const updatedTask = await Task.findById(task._id).populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
      { path: "testAttachments.uploadedBy", select: "name email avatar" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Attachment added successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
    console.error("Add attachment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add attachment",
    });
  }
};
