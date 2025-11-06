import apiClient from "../apiClient";

export const unblockContact = async (userId) => {
  const res = await apiClient.post(`/contacts/unblock/${userId}`);
  return res?.data || res;
};
