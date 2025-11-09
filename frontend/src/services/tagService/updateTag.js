import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateTag = async (tagId, updates) => {
  const response = await apiClient.put(
    API_ENDPOINTS.TAGS.UPDATE(tagId),
    updates
  );
  return ResponseNormalizer.normalizeItem(response, "tag");
};
