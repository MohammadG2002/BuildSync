import apiClient, { API_ENDPOINTS } from "../apiClient";

export const sendMessage = async (messageData) => {
  return await apiClient.post(API_ENDPOINTS.CHAT.SEND, messageData);
};
