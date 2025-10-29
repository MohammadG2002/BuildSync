import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const getWorkspaceMembers = async (workspaceId) => {
  const response = await apiClient.get(
    API_ENDPOINTS.WORKSPACES.MEMBERS(workspaceId)
  );
  return ResponseNormalizer.normalizeList(response, "members");
};
