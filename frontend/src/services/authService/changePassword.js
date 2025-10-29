import apiClient, { API_ENDPOINTS } from "../apiClient";

export const changePassword = async (passwordData) => {
  return await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
};
