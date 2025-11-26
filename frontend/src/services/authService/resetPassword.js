import apiClient, { API_ENDPOINTS } from "../apiClient";

export const resetPassword = async ({ email, code, newPassword }) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    email,
    code,
    newPassword,
  });
};
