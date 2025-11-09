import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteTag = async (tagId) => {
  const response = await apiClient.delete(API_ENDPOINTS.TAGS.DELETE(tagId));
  return ResponseNormalizer.normalizeAction(response);
};
