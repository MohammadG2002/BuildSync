import { createContext, useState, useEffect } from "react";
import * as workspaceService from "../services/workspaceService";
import toast from "react-hot-toast";

export const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await workspaceService.getWorkspaces();
      setWorkspaces(data);

      // Set first workspace as current if none selected
      if (!currentWorkspace && data.length > 0) {
        setCurrentWorkspace(data[0]);
        localStorage.setItem("currentWorkspaceId", data[0].id);
      }
    } catch (error) {
      toast.error("Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  };

  // Create new workspace
  const createWorkspace = async (workspaceData) => {
    try {
      const newWorkspace = await workspaceService.createWorkspace(
        workspaceData
      );
      setWorkspaces([...workspaces, newWorkspace]);
      toast.success("Workspace created successfully!");
      return newWorkspace;
    } catch (error) {
      toast.error("Failed to create workspace");
      throw error;
    }
  };

  // Update workspace
  const updateWorkspace = async (workspaceId, workspaceData) => {
    try {
      const updated = await workspaceService.updateWorkspace(
        workspaceId,
        workspaceData
      );
      setWorkspaces(
        workspaces.map((w) => (w.id === workspaceId ? updated : w))
      );
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(updated);
      }
      toast.success("Workspace updated successfully!");
      return updated;
    } catch (error) {
      toast.error("Failed to update workspace");
      throw error;
    }
  };

  // Delete workspace
  const deleteWorkspace = async (workspaceId) => {
    try {
      await workspaceService.deleteWorkspace(workspaceId);
      setWorkspaces(workspaces.filter((w) => w.id !== workspaceId));
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(workspaces[0] || null);
      }
      toast.success("Workspace deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete workspace");
      throw error;
    }
  };

  // Switch workspace
  const switchWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem("currentWorkspaceId", workspace.id);
    toast.success(`Switched to ${workspace.name}`);
  };

  // Load current workspace from localStorage on mount
  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");
    if (savedWorkspaceId && workspaces.length > 0) {
      const workspace = workspaces.find((w) => w.id === savedWorkspaceId);
      if (workspace) {
        setCurrentWorkspace(workspace);
      }
    }
  }, [workspaces]);

  const value = {
    workspaces,
    currentWorkspace,
    loading,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    switchWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
