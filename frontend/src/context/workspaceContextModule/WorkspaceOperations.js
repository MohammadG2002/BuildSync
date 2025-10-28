/**
 * Workspace Operations - Business logic for workspace CRUD operations
 */
export class WorkspaceOperations {
  /**
   * Add new workspace to list
   * @param {Array} workspaces - Current workspaces array
   * @param {Object} newWorkspace - New workspace to add
   * @returns {Array} Updated workspaces array
   */
  static addWorkspace(workspaces, newWorkspace) {
    return [...workspaces, newWorkspace];
  }

  /**
   * Update existing workspace in list
   * @param {Array} workspaces - Current workspaces array
   * @param {string} workspaceId - ID of workspace to update
   * @param {Object} updatedWorkspace - Updated workspace data
   * @returns {Array} Updated workspaces array
   */
  static updateWorkspace(workspaces, workspaceId, updatedWorkspace) {
    return workspaces.map((w) => (w.id === workspaceId ? updatedWorkspace : w));
  }

  /**
   * Remove workspace from list
   * @param {Array} workspaces - Current workspaces array
   * @param {string} workspaceId - ID of workspace to remove
   * @returns {Array} Updated workspaces array
   */
  static deleteWorkspace(workspaces, workspaceId) {
    return workspaces.filter((w) => w.id !== workspaceId);
  }

  /**
   * Get first workspace from list
   * @param {Array} workspaces - Workspaces array
   * @returns {Object|null} First workspace or null
   */
  static getFirstWorkspace(workspaces) {
    return workspaces.length > 0 ? workspaces[0] : null;
  }

  /**
   * Check if workspace should be updated
   * @param {Object} currentWorkspace - Currently selected workspace
   * @param {string} workspaceId - ID to check
   * @returns {boolean} True if should update
   */
  static shouldUpdateCurrent(currentWorkspace, workspaceId) {
    return currentWorkspace?.id === workspaceId;
  }
}
