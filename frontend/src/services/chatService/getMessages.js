import apiClient, { API_ENDPOINTS } from "../apiClient";

export const getMessages = async (contactId) => {
  return await apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(contactId));
};
