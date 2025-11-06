import apiClient from "../apiClient";

// POST /chat/dm/:userId with { content, type?, attachments? }
export const sendDirectMessage = async (userId, payload) => {
  const endpoint = `/chat/dm/${userId}`;
  const res = await apiClient.post(endpoint, payload);
  // fetch-based client returns parsed JSON; backend shape: { success, data: { message } }
  return res?.data?.message || null;
};
