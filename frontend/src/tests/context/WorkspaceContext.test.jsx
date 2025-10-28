import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { WorkspaceProvider } from "../../context/WorkspaceContext";
import { useWorkspace } from "../../hooks/useWorkspace";
import { WorkspaceStorage } from "../../context/workspaceContextModule/WorkspaceStorage";

describe("WorkspaceStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should save workspace ID to localStorage", () => {
    WorkspaceStorage.saveWorkspaceId("workspace-123");

    const saved = localStorage.getItem("currentWorkspaceId");
    expect(saved).toBe("workspace-123");
  });

  it("should get workspace ID from localStorage", () => {
    localStorage.setItem("currentWorkspaceId", "workspace-456");

    const retrieved = WorkspaceStorage.getSavedWorkspaceId();
    expect(retrieved).toBe("workspace-456");
  });

  it("should return null when no workspace ID exists", () => {
    const retrieved = WorkspaceStorage.getSavedWorkspaceId();
    expect(retrieved).toBeNull();
  });

  it("should clear workspace ID from localStorage", () => {
    localStorage.setItem("currentWorkspaceId", "workspace-789");

    WorkspaceStorage.clearWorkspaceId();
    expect(localStorage.getItem("currentWorkspaceId")).toBeNull();
  });

  it("should find workspace by ID in workspaces array", () => {
    const workspaces = [
      { id: "1", name: "Workspace 1" },
      { id: "2", name: "Workspace 2" },
      { id: "3", name: "Workspace 3" },
    ];

    const found = WorkspaceStorage.findWorkspace(workspaces, "2");
    expect(found).toEqual({ id: "2", name: "Workspace 2" });
  });

  it("should return null when workspace ID not found", () => {
    const workspaces = [{ id: "1", name: "Workspace 1" }];

    const found = WorkspaceStorage.findWorkspace(workspaces, "99");
    expect(found).toBeNull();
  });
});
describe("WorkspaceContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("WorkspaceProvider", () => {
    it("should provide workspace context to children", () => {
      const { result } = renderHook(() => useWorkspace(), {
        wrapper: WorkspaceProvider,
      });

      expect(result.current).toHaveProperty("currentWorkspace");
      expect(result.current).toHaveProperty("workspaces");
      expect(result.current).toHaveProperty("switchWorkspace");
      expect(result.current).toHaveProperty("createWorkspace");
      expect(result.current).toHaveProperty("updateWorkspace");
      expect(result.current).toHaveProperty("deleteWorkspace");
      expect(result.current).toHaveProperty("fetchWorkspaces");
    });

    it("should initialize with empty workspaces", () => {
      const { result } = renderHook(() => useWorkspace(), {
        wrapper: WorkspaceProvider,
      });

      expect(result.current.workspaces).toEqual([]);
      expect(result.current.currentWorkspace).toBeNull();
    });

    it("should have loading state", () => {
      const { result } = renderHook(() => useWorkspace(), {
        wrapper: WorkspaceProvider,
      });

      expect(result.current).toHaveProperty("loading");
      expect(typeof result.current.loading).toBe("boolean");
    });
  });
});
