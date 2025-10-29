import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getWorkspaceById = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.GET(workspaceId)
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};
