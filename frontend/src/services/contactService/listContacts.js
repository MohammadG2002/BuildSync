import apiClient from "../apiClient";

// GET /contacts?status=accepted|pending|blocked
export const listContacts = async (status = "accepted") => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await apiClient.get(`/contacts${query}`);
  // Backend: { success, count, data: { contacts: [...] } }
  return res?.data?.contacts || [];
};
