import api from "./api";

export const getContacts = async () => {
  try {
    const response = await api.get("/chat/contacts");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getMessages = async (contactId) => {
  try {
    const response = await api.get(`/chat/messages/${contactId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/messages", messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markAsRead = async (messageId) => {
  try {
    const response = await api.put(`/chat/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
