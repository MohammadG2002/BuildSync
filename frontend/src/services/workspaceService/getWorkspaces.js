import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getWorkspaces = async () => {
  const response = await apiClient.get(API_ENDPOINTS.WORKSPACES.LIST);
  // Backend returns: { success: true, data: { workspaces: [...] } }
  return ResponseNormalizer.normalizeList(response, "workspaces");
};
