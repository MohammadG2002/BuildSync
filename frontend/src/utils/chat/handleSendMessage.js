import * as chatService from "../../services/chatService";

/**
 * Handle sending a message
 */
const handleSendMessage = async (
  message,
  workspaceId,
  selectedContact,
  user,
  messages,
  setMessages,
  setMessage
) => {
  if (!message.trim()) return;

  const newMessage = {
    id: Date.now().toString(),
    senderId: user?.id,
    senderName: user?.name,
    content: message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  try {
    if (selectedContact?.id) {
      await chatService.sendDirectMessage(workspaceId, selectedContact.id, {
        content: message,
      });
    } else {
      await chatService.sendMessage(workspaceId, { content: message });
    }
    setMessages([...messages, newMessage]);
    setMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default handleSendMessage;
