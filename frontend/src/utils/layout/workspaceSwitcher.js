/**
 * Determines the navigation path when switching workspaces based on current location
 * @param {string} currentPath - Current location pathname
 * @param {string} newWorkspaceId - ID of the workspace to switch to
 * @returns {string} - The path to navigate to
 */
export const getWorkspaceSwitchPath = (currentPath, newWorkspaceId) => {
  // Extract the current page type from the path
  const pathSegments = currentPath.split("/").filter(Boolean);

  // If on dashboard or workspaces list, go to workspace details
  if (
    currentPath.includes("/app/dashboard") ||
    currentPath === "/app/workspaces"
  ) {
    return `/app/workspaces/${newWorkspaceId}`;
  }

  // If on members page, switch to new workspace members
  if (currentPath.includes("/members")) {
    return `/app/workspaces/${newWorkspaceId}/members`;
  }

  // If on settings page, switch to new workspace settings
  if (currentPath.includes("/settings")) {
    return `/app/workspaces/${newWorkspaceId}/settings`;
  }

  // If on archived page, switch to new workspace archived
  if (currentPath.includes("/archived")) {
    return `/app/workspaces/${newWorkspaceId}/archived`;
  }

  // If on a project details page, go to workspace details
  if (currentPath.includes("/projects/")) {
    return `/app/workspaces/${newWorkspaceId}`;
  }

  // If on workspace details, switch to new workspace details
  if (currentPath.includes("/workspaces/")) {
    return `/app/workspaces/${newWorkspaceId}`;
  }

  // Default: go to workspace details
  return `/app/workspaces/${newWorkspaceId}`;
};
