import apiClient, { API_ENDPOINTS } from "../apiClient";

export const forgotPassword = async (email) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};
