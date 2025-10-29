import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const createWorkspace = async (workspaceData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.CREATE,
    workspaceData
  );
  // Backend returns: { success: true, data: { workspace: {...} } }
  return ResponseNormalizer.normalizeItem(response, "workspace");
};
