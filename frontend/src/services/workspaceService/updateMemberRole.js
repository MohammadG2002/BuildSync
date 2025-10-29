import apiClient, { API_ENDPOINTS } from "../apiClient";
import { ResponseNormalizer } from "../shared";

export const updateMemberRole = async (workspaceId, memberId, role) => {
  const response = await apiClient.put(
    API_ENDPOINTS.WORKSPACES.UPDATE_MEMBER(workspaceId, memberId),
    { role }
  );
  return ResponseNormalizer.normalizeItem(response, "member");
};
