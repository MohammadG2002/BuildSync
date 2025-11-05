import apiClient from "../apiClient";

// Backend route: GET /chat/:workspaceId -> { success, data: { messages } }
export const getMessages = async (workspaceId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/chat/${workspaceId}${query ? `?${query}` : ""}`;
  const res = await apiClient.get(endpoint);
  return res?.data?.messages || [];
};
