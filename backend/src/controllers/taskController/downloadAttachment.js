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
    const { url: fallbackUrl, name: fallbackName, section } = req.query || {};
    const targetArray = section === "test" ? "testAttachments" : "attachments";
    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    let attachment = task[targetArray]?.id?.(attachmentId) || null;
    if (!attachment && Array.isArray(task[targetArray])) {
      const idx = task[targetArray].findIndex(
        (att) => att._id?.toString() === attachmentId?.toString()
      );
      if (idx !== -1) attachment = task[targetArray][idx];
    }

    // If attachment not found by id, attempt graceful fallback using provided URL
    // This helps for legacy data or rare mismatches.
    let derivedUrl = attachment?.url || "";
    let downloadName = attachment?.originalName || attachment?.filename;
    if (!attachment && fallbackUrl) {
      derivedUrl = fallbackUrl;
      downloadName = fallbackName || downloadName;
    }

    if (!attachment && !fallbackUrl) {
      return res
        .status(404)
        .json({ success: false, message: "Attachment not found" });
    }

    // Determine stored filename: prefer deriving from URL (actual disk filename),
    // fall back to attachment.filename only if URL is missing.
    const cleanUrl = (derivedUrl || "").split("?")[0];
    const nameFromUrl = cleanUrl ? path.basename(cleanUrl) : undefined;
    const fileNameFromField = attachment?.filename || undefined;
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

    const finalDownloadName = downloadName || storedFileName;

    // Set headers and stream file
    res.setHeader(
      "Content-Type",
      attachment?.mimetype || "application/octet-stream"
    );
    return res.download(filePath, finalDownloadName);
  } catch (error) {
    console.error("Download attachment error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to download attachment" });
  }
};
