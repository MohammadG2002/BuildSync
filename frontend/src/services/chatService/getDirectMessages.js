import apiClient from "../apiClient";

// GET /chat/:workspaceId/dm/:userId -> { success, data: { messages } }
export const getDirectMessages = async (workspaceId, userId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/chat/${workspaceId}/dm/${userId}${
    query ? `?${query}` : ""
  }`;
  const res = await apiClient.get(endpoint);
  return res?.data?.messages || [];
};
