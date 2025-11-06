import apiClient from "../apiClient";

// PUT /chat/dm/:userId/read -> marks all incoming messages from userId as read
export const markDirectRead = async (userId) => {
  const endpoint = `/chat/dm/${userId}/read`;
  const res = await apiClient.put(endpoint);
  return res?.data || res;
};
