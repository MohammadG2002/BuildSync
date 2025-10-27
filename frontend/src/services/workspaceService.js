import api from "./api";

export const getWorkspaces = async () => {
  try {
    const response = await api.get("/workspaces");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getWorkspaceById = async (workspaceId) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createWorkspace = async (workspaceData) => {
  try {
    const response = await api.post("/workspaces", workspaceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateWorkspace = async (workspaceId, workspaceData) => {
  try {
    const response = await api.put(`/workspaces/${workspaceId}`, workspaceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteWorkspace = async (workspaceId) => {
  try {
    const response = await api.delete(`/workspaces/${workspaceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Members
export const getWorkspaceMembers = async (workspaceId) => {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addWorkspaceMember = async (workspaceId, memberData) => {
  try {
    const response = await api.post(
      `/workspaces/${workspaceId}/members`,
      memberData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateMemberRole = async (workspaceId, memberId, role) => {
  try {
    const response = await api.put(
      `/workspaces/${workspaceId}/members/${memberId}`,
      { role }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const removeMember = async (workspaceId, memberId) => {
  try {
    const response = await api.delete(
      `/workspaces/${workspaceId}/members/${memberId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
