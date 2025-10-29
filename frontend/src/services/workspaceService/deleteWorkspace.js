import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const deleteWorkspace = async (workspaceId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.DELETE(workspaceId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
