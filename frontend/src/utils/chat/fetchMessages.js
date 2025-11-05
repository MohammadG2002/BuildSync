import * as chatService from "../../services/chatService";
import { buildAbsoluteUrl } from "../buildAbsoluteUrl";

/**
 * Fetch messages for the current workspace
 * Optionally filter by a selected contact (senderId)
 */
const fetchMessages = async (setMessages, selectedContactId) => {
  try {
    if (!selectedContactId) {
      setMessages([]);
      return;
    }
    const serverMessages = await chatService.getDirectMessages(
      selectedContactId
    );

    const normalized = (serverMessages || []).map((m) => ({
      id: m._id || m.id,
      senderId: m.sender?._id || m.senderId,
      senderName: m.sender?.name || m.senderName,
      content: m.content,
      timestamp: m.createdAt || m.timestamp,
      attachments: Array.isArray(m.attachments)
        ? m.attachments.map((a) => ({
            ...a,
            url: buildAbsoluteUrl(
              a?.url || a?.path || a?.href || a?.relativeUrl
            ),
          }))
        : [],
    }));

    setMessages(normalized);
  } catch (error) {
    console.error("Error fetching messages:", error);
    setMessages([]);
  }
};

export default fetchMessages;
