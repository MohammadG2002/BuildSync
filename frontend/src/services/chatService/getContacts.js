import apiClient, { API_ENDPOINTS } from "../apiClient";

export const getContacts = async () => {
  return await apiClient.get(API_ENDPOINTS.CHAT.CONTACTS);
};
