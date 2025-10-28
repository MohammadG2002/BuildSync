/**
 * Workspace Storage - Handles localStorage operations for workspace
 */
export class WorkspaceStorage {
  static STORAGE_KEY = "currentWorkspaceId";

  /**
   * Get saved workspace ID from localStorage
   * @returns {string|null} Workspace ID or null
   */
  static getSavedWorkspaceId() {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  /**
   * Save workspace ID to localStorage
   * @param {string} workspaceId - Workspace ID to save
   */
  static saveWorkspaceId(workspaceId) {
    localStorage.setItem(this.STORAGE_KEY, workspaceId);
  }

  /**
   * Remove workspace ID from localStorage
   */
  static clearWorkspaceId() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Find workspace by ID from list
   * @param {Array} workspaces - List of workspaces
   * @param {string} workspaceId - Workspace ID to find
   * @returns {Object|null} Workspace object or null
   */
  static findWorkspace(workspaces, workspaceId) {
    return workspaces.find((w) => w.id === workspaceId) || null;
  }
}
