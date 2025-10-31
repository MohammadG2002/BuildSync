/**
 * Add Attachment Controller
 * @desc    Add attachment to task
 * @route   POST /api/tasks/:id/attachments
 * @access  Private
 */

import Task from "../../models/Task/index.js";

export const addAttachment = async (req, res) => {
  try {
    const { name, url, size, type } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        message: "Attachment name and URL are required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.attachments.push({
      name,
      url,
      size,
      type,
      uploadedBy: req.user._id,
    });

    await task.save();

    // Populate task before returning
    await task.populate([
      { path: "assignedTo", select: "name email avatar" },
      { path: "createdBy", select: "name email avatar" },
      { path: "project", select: "name" },
      { path: "workspace", select: "name" },
      { path: "comments.user", select: "name email avatar" },
      { path: "attachments.uploadedBy", select: "name email avatar" },
    ]);

    res.status(201).json({
      success: true,
      message: "Attachment added successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Add attachment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add attachment",
    });
  }
};
