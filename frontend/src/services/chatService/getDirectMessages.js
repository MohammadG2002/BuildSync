import apiClient from "../apiClient";

// GET /chat/dm/:userId -> { success, data: { messages } }
export const getDirectMessages = async (userId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/chat/dm/${userId}${query ? `?${query}` : ""}`;
  const res = await apiClient.get(endpoint);
  // Backend returns { success, count, data: { messages } }
  return res?.data?.data?.messages || res?.data?.messages || [];
};
