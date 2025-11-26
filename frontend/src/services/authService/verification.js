import apiClient, { API_ENDPOINTS } from "../apiClient";

export const sendVerificationCode = async (email) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.SEND_VERIFICATION, {
    email,
  });
  return response;
};

export const verifyEmailCode = async (email, code) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
    email,
    code,
  });
  return response;
};
