import apiClient, { API_ENDPOINTS } from "./apiClient";

export const register = async (userData) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
};

export const login = async (credentials) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

export const logout = async () => {
  return await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};

export const getCurrentUser = async () => {
  return await apiClient.get(API_ENDPOINTS.AUTH.ME);
};

export const updateProfile = async (userData) => {
  return await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, userData);
};

export const changePassword = async (passwordData) => {
  return await apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
};

export const forgotPassword = async (email) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
};

export const resetPassword = async (token, password) => {
  return await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
    token,
    password,
  });
};
