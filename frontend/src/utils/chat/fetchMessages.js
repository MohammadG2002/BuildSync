import * as chatService from "../../services/chatService";

/**
 * Fetch messages for a specific contact
 */
const fetchMessages = async (contactId, setMessages) => {
  try {
    const data = await chatService.getMessages(contactId);
    setMessages(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    setMessages([]);
  }
};

export default fetchMessages;
