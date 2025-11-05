import apiClient from "../apiClient";

// DELETE /contacts/:userId
export const removeContact = async (userId) => {
  const res = await apiClient.delete(`/contacts/${userId}`);
  return res?.success === true;
};
