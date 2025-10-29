import apiClient, { API_ENDPOINTS } from "../apiClient";

export const resetPassword = async (token, password) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token,
    password,
  });
};
