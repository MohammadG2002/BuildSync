import apiClient from "../apiClient";

// POST /contacts/request with { email }
export const requestContactByEmail = async (email) => {
  const res = await apiClient.post(`/contacts/request`, { email });
  // Backend response: { success, message, data: { contact } }
  return res?.data?.contact || null;
};
