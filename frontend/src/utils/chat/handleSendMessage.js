import * as chatService from "../../../services/chatService";

/**
 * Handle sending a message
 */
const handleSendMessage = async (
  message,
  selectedContact,
  user,
  messages,
  setMessages,
  setMessage
) => {
  if (!message.trim() || !selectedContact) return;

  const newMessage = {
    id: Date.now().toString(),
    senderId: user?.id,
    senderName: user?.name,
    content: message,
    timestamp: new Date().toISOString(),
    read: false,
  };

  try {
    await chatService.sendMessage(selectedContact.id, message);
    setMessages([...messages, newMessage]);
    setMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export default handleSendMessage;
