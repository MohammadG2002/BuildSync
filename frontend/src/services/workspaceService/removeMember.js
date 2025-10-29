import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const removeMember = async (workspaceId, memberId) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.WORKSPACES.REMOVE_MEMBER(workspaceId, memberId)
  );
  return ResponseNormalizer.normalizeAction(response);
};
