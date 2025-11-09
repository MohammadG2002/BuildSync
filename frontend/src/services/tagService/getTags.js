import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getTags = async (workspaceId) => {
  const response = await apiClient.get(API_ENDPOINTS.TAGS.LIST(workspaceId));
  return ResponseNormalizer.normalizeList(response, "tags");
};
