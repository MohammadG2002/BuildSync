import { createContext, useState, useEffect } from "react";
import * as workspaceService from "../services/workspaceService";
import toast from "react-hot-toast";
import {
  WorkspaceStorage,
  WorkspaceOperations,
} from "./workspaceContextModule";

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
        const firstWorkspace = WorkspaceOperations.getFirstWorkspace(data);
        setCurrentWorkspace(firstWorkspace);
        WorkspaceStorage.saveWorkspaceId(firstWorkspace.id);
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
      setWorkspaces(WorkspaceOperations.addWorkspace(workspaces, newWorkspace));
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
        WorkspaceOperations.updateWorkspace(workspaces, workspaceId, updated)
      );
      if (
        WorkspaceOperations.shouldUpdateCurrent(currentWorkspace, workspaceId)
      ) {
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
      const updatedWorkspaces = WorkspaceOperations.deleteWorkspace(
        workspaces,
        workspaceId
      );
      setWorkspaces(updatedWorkspaces);
      if (
        WorkspaceOperations.shouldUpdateCurrent(currentWorkspace, workspaceId)
      ) {
        setCurrentWorkspace(
          WorkspaceOperations.getFirstWorkspace(updatedWorkspaces)
        );
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
    WorkspaceStorage.saveWorkspaceId(workspace.id);
    toast.success(`Switched to ${workspace.name}`);
  };

  // Load current workspace from localStorage on mount
  useEffect(() => {
    const savedWorkspaceId = WorkspaceStorage.getSavedWorkspaceId();
    if (savedWorkspaceId && workspaces.length > 0) {
      const workspace = WorkspaceStorage.findWorkspace(
        workspaces,
        savedWorkspaceId
      );
      if (workspace) {
        setCurrentWorkspace(workspace);
      } else {
        // Saved workspace no longer accessible; fallback to first available
        const first = WorkspaceOperations.getFirstWorkspace(workspaces);
        setCurrentWorkspace(first);
        if (first?.id) {
          WorkspaceStorage.saveWorkspaceId(first.id);
        } else {
          WorkspaceStorage.clearWorkspaceId();
        }
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
