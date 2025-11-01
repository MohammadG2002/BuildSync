/**
 * Download Attachment Controller
 * @desc    Streams an attachment with Content-Disposition: attachment
 * @route   GET /api/tasks/:id/attachments/:attachmentId/download
 * @access  Private
 */

import path from "path";
import fs from "fs";
import Task from "../../models/Task/index.js";

export const downloadAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    const attachment = task.attachments.id(attachmentId);
    if (!attachment) {
      return res
        .status(404)
        .json({ success: false, message: "Attachment not found" });
    }

    // Determine stored filename: prefer deriving from URL (actual disk filename),
    // fall back to attachment.filename only if URL is missing.
    const url = attachment.url || "";
    const cleanUrl = url.split("?")[0];
    const nameFromUrl = cleanUrl ? path.basename(cleanUrl) : undefined;
    const fileNameFromField = attachment.filename || undefined;
    const storedFileName = nameFromUrl || fileNameFromField;

    if (!storedFileName) {
      return res
        .status(400)
        .json({ success: false, message: "Attachment filename unavailable" });
    }

    // Build absolute file path under uploads/attachments
    const filePath = path.join(
      process.cwd(),
      "uploads",
      "attachments",
      storedFileName
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File not found on server" });
    }

    const downloadName = attachment.originalName || storedFileName;

    // Set headers and stream file
    res.setHeader(
      "Content-Type",
      attachment.mimetype || "application/octet-stream"
    );
    return res.download(filePath, downloadName);
  } catch (error) {
    console.error("Download attachment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to download attachment" });
  }
};
