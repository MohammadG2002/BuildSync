import apiClient from "../apiClient";

export const blockContact = async (userId) => {
  const res = await apiClient.post(`/contacts/block/${userId}`);
  return res?.data || res;
};
