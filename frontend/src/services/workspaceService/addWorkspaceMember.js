import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const addWorkspaceMember = async (workspaceId, memberData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.WORKSPACES.ADD_MEMBER(workspaceId),
    memberData
  );
  return ResponseNormalizer.normalizeItem(response, "member");
};
