import apiClient from "../apiClient";

export const markAsRead = async (messageId) => {
  return await apiClient.put(`/chat/messages/${messageId}/read`);
};
