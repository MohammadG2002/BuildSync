import apiClient from "../apiClient";

// POST /contacts/accept/:userId
export const acceptContact = async (userId) => {
  const res = await apiClient.post(`/contacts/accept/${userId}`);
  // Backend response: { success, message, data: { contact } }
  return res?.data?.contact || null;
};
