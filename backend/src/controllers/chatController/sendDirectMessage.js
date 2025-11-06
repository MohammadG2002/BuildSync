/**
 * Send Direct Message Controller
 * @desc    Send a direct message to a user in a workspace
 * @route   POST /api/chat/:workspaceId/dm/:userId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import Contact from "../../models/Contact/index.js";
import Workspace from "../../models/Workspace/index.js";
import { sendEventToUser } from "../../websocket/index.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { content = "", type = "text", attachments } = req.body;
    // Sanitize attachments
    const cleanedAttachments = Array.isArray(attachments)
      ? attachments
          .filter((a) => a && typeof a === "object")
          .map((a) => ({
            name: a.name || "Attachment",
            url: a.url,
            size: typeof a.size === "number" ? a.size : undefined,
            type: a.type || undefined,
          }))
          .filter((a) => typeof a.url === "string" && a.url.length > 0)
      : [];

    const hasText = typeof content === "string" && content.trim() !== "";
    const hasAttachments = cleanedAttachments.length > 0;
    if (!hasText && !hasAttachments) {
      return res.status(400).json({
        success: false,
        message: "Message must include text or at least one attachment",
      });
    }

    // Optional workspace membership validation when workspaceId is provided
    let workspace = null;
    if (workspaceId) {
      workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res
          .status(404)
          .json({ success: false, message: "Workspace not found" });
      }
      if (!workspace.isMember(req.user._id) || !workspace.isMember(userId)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    }

    // Prevent sending if contact is blocked
    try {
      const me = req.user._id.toString();
      const other = userId.toString();
      const pair = [me, other].sort();
      const contact = await Contact.findOne({
        "users.0": pair[0],
        "users.1": pair[1],
      }).select("status blockedBy");
      if (contact && contact.status === "blocked") {
        return res.status(403).json({
          success: false,
          message: "Messaging is blocked for this contact",
        });
      }
    } catch (e) {
      // Non-fatal; proceed if contact lookup fails
      console.warn("Contact lookup failed during DM send:", e?.message || e);
    }

    const message = await Message.create({
      workspace: workspace?._id || undefined,
      sender: req.user._id,
      recipient: userId,
      content: hasText ? content : "",
      type,
      attachments: hasAttachments ? cleanedAttachments : [],
    });

    await message.populate("sender", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { message },
    });

    // Realtime: deliver DM to both participants only
    try {
      sendEventToUser(userId, "dm_message", message);
      sendEventToUser(req.user._id, "dm_message", message);
    } catch (e) {
      console.error("DM broadcast failed:", e);
    }
  } catch (error) {
    console.error("Send direct message error:", error);
    const body = { success: false, message: "Failed to send message" };
    if (process.env.NODE_ENV !== "production") {
      body.error = error?.message;
    }
    res.status(500).json(body);
  }
};
