import apiClient from "../apiClient";

// POST /contacts/request/:userId
export const requestContactByUserId = async (userId) => {
  const res = await apiClient.post(`/contacts/request/${userId}`);
  // Backend response: { success, message, data: { contact } }
  return res?.data?.contact || null;
};
