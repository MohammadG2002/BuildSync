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

  const newMessage = {
    id: Date.now().toString(),
    senderId: user?.id,
    senderName: user?.name,
    content: message,
    timestamp: new Date().toISOString(),
    read: false,
    attachments: [],
  };

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
      newMessage.attachments = uploaded;
    }

    if (selectedContact?.id) {
      await chatService.sendDirectMessage(selectedContact.id, {
        content: message,
        attachments: uploaded,
      });
    }
    setMessages([...messages, newMessage]);
    setMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default handleSendMessage;
