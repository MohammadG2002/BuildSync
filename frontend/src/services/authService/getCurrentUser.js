import apiClient, { API_ENDPOINTS } from "../apiClient";

export const getCurrentUser = async () => {
  return await apiClient.get(API_ENDPOINTS.AUTH.ME);
};
