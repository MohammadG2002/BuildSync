import { useMemo } from "react";

/**
 * Custom hook for checking user permissions and roles
 */
export const useProjectPermissions = (
  user,
  project,
  members,
  currentUserId,
) => {
  const projectOwnerId = useMemo(
    () => project?.owner?._id || project?.owner,
    [project],
  );

  const currentProjectMember = useMemo(
    () =>
      (project?.members || []).find(
        (m) => (m?.user?._id || m?.user || m?.id || m?._id) === currentUserId,
      ),
    [project, currentUserId],
  );

  const canManageMembers = useMemo(
    () =>
      !!currentUserId &&
      (currentUserId === projectOwnerId ||
        currentProjectMember?.role === "admin"),
    [currentUserId, projectOwnerId, currentProjectMember],
  );

  const currentWorkspaceRole = useMemo(() => {
    const found = (members || []).find((m) => m.id === currentUserId);
    return found?.role || null;
  }, [members, currentUserId]);

  const isViewer = useMemo(
    () => currentWorkspaceRole === "viewer",
    [currentWorkspaceRole],
  );

  const canModerateComments = useMemo(
    () =>
      currentWorkspaceRole === "owner" ||
      currentWorkspaceRole === "admin" ||
      canManageMembers,
    [currentWorkspaceRole, canManageMembers],
  );

  return {
    projectOwnerId,
    currentProjectMember,
    canManageMembers,
    currentWorkspaceRole,
    isViewer,
    canModerateComments,
  };
};
