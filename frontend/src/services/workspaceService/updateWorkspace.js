import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateWorkspace = async (workspaceId, workspaceData) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE(workspaceId),
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};
