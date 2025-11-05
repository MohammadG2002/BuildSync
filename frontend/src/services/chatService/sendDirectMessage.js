import apiClient from "../apiClient";

// POST /chat/:workspaceId/dm/:userId with { content, type?, attachments? }
export const sendDirectMessage = async (workspaceId, userId, payload) => {
  const endpoint = `/chat/${workspaceId}/dm/${userId}`;
  const res = await apiClient.post(endpoint, payload);
  return res?.data?.message || null;
};
