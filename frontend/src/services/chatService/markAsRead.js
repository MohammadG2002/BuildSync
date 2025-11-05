import apiClient from "../apiClient";

// Backend route: PUT /chat/:workspaceId/:messageId/read
export const markAsRead = async (workspaceId, messageId) => {
  const endpoint = `/chat/${workspaceId}/${messageId}/read`;
  const res = await apiClient.put(endpoint);
  return res?.data || null;
};
