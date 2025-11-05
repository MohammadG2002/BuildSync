import * as chatService from "../../services/chatService";

/**
 * Fetch messages for the current workspace
 * Optionally filter by a selected contact (senderId)
 */
const fetchMessages = async (workspaceId, setMessages, selectedContactId) => {
  try {
    const serverMessages = selectedContactId
      ? await chatService.getDirectMessages(workspaceId, selectedContactId)
      : await chatService.getMessages(workspaceId);

    const normalized = (serverMessages || []).map((m) => ({
      id: m._id || m.id,
      senderId: m.sender?._id || m.senderId,
      senderName: m.sender?.name || m.senderName,
      content: m.content,
      timestamp: m.createdAt || m.timestamp,
    }));

    setMessages(normalized);
  } catch (error) {
    console.error("Error fetching messages:", error);
    setMessages([]);
  }
};

export default fetchMessages;
