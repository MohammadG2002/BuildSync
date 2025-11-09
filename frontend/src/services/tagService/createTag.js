import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createTag = async (tagData) => {
  const response = await apiClient.post(API_ENDPOINTS.TAGS.CREATE(), tagData);
  return ResponseNormalizer.normalizeItem(response, "tag");
};
