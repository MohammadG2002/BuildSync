import apiClient, { API_ENDPOINTS } from "../apiClient";

export const updateProfile = async (userData) => {
  const resp = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
  // Backend shape: { success, message, data: { user } }
  const user = resp?.data?.data?.user; // drill into data wrapper
  return user || userData;
};
