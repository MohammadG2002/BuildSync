import apiClient, { API_ENDPOINTS } from "./apiClient";

export const getContacts = async () => {
  return await apiClient.get(API_ENDPOINTS.CHAT.CONTACTS);
};

export const getMessages = async (contactId) => {
  return await apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(contactId));
};

export const sendMessage = async (messageData) => {
  return await apiClient.post(API_ENDPOINTS.CHAT.SEND, messageData);
};

export const markAsRead = async (messageId) => {
  return await apiClient.put(`/chat/messages/${messageId}/read`);
};
