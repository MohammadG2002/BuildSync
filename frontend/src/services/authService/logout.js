import apiClient, { API_ENDPOINTS } from "../apiClient";

export const logout = async () => {
  return await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};
