import * as chatService from "../../services/chatService";
import apiClient from "../../services/apiClient";

/**
 * Handle sending a message
 */
const handleSendMessage = async (
  message,
  selectedContact,
  user,
  messages,
  setMessages,
  setMessage,
  attachments = []
) => {
  const hasText = (message || "").trim().length > 0;
  const hasFiles = Array.isArray(attachments) && attachments.length > 0;
  if (!hasText && !hasFiles) return;

  // Prepare placeholder for attachments; we'll use server-created message for UI
  const clientUploaded = [];

  try {
    // Upload attachments first (if any)
    let uploaded = [];
    if (hasFiles) {
      uploaded = await Promise.all(
        attachments.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await apiClient.post("/upload/attachment", formData);
          const data = res?.data?.data || res?.data || {};
          return {
            name: data.name || data.originalName || data.filename || file?.name,
            url: data.url,
            size: data.size ?? file?.size,
            type: data.type || data.mimetype || file?.type,
          };
        })
      );
      clientUploaded.push(...uploaded);
    }

    if (selectedContact?.id) {
      const created = await chatService.sendDirectMessage(selectedContact.id, {
        content: message,
        attachments: uploaded,
      });
      // Append the server-created message to avoid duplicate with realtime echo
      if (created) {
        const normalized = {
          id: created._id || created.id,
          senderId: created.sender?._id || created.senderId || user?.id,
          senderName: created.sender?.name || created.senderName || user?.name,
          content: created.content ?? message,
          timestamp:
            created.createdAt || created.timestamp || new Date().toISOString(),
          attachments: created.attachments?.length
            ? created.attachments
            : clientUploaded,
        };
        setMessages([...messages, normalized]);
      }
    }
    setMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default handleSendMessage;
