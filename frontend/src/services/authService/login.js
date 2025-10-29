import apiClient, { API_ENDPOINTS } from "../apiClient";

export const login = async (credentials) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
};
