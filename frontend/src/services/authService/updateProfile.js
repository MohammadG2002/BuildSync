import apiClient, { API_ENDPOINTS } from "../apiClient";

export const updateProfile = async (userData) => {
  return await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, userData);
};
