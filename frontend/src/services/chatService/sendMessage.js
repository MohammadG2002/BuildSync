import apiClient from "../apiClient";

// Backend route: POST /chat/:workspaceId with { content, type?, attachments? }
export const sendMessage = async (workspaceId, payload) => {
  const endpoint = `/chat/${workspaceId}`;
  const res = await apiClient.post(endpoint, payload);
  return res?.data?.message || null;
};
