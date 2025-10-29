import apiClient, { API_ENDPOINTS } from "../apiClient";

export const register = async (userData) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
};
