/**
 * Notification Transformer - Transforms WebSocket events to notification objects
 */
export class NotificationTransformer {
  /**
   * Create notification from task update event
   * @param {Object} task - Task data
   * @returns {Object} Notification object
   */
  static fromTaskUpdate(task) {
    return {
      type: "task_update",
      title: "Task Updated",
      message: `Task "${task.title}" has been updated`,
      actionUrl: `/app/workspaces/${task.workspaceId}/projects/${task.projectId}`,
    };
  }

  /**
   * Create notification from project update event
   * @param {Object} project - Project data
   * @returns {Object} Notification object
   */
  static fromProjectUpdate(project) {
    return {
      type: "project_update",
      title: "Project Updated",
      message: `Project "${project.name}" has been updated`,
      actionUrl: `/app/workspaces/${project.workspaceId}`,
    };
  }

  /**
   * Create notification from member joined event
   * @param {Object} member - Member data
   * @returns {Object} Notification object
   */
  static fromMemberJoined(member) {
    return {
      type: "member_joined",
      title: "New Member",
      message: `${member.name} joined the workspace`,
      actionUrl: `/app/workspaces/${member.workspaceId}/members`,
    };
  }

  /**
   * Add default fields to notification
   * @param {Object} notification - Partial notification data
   * @returns {Object} Complete notification object
   */
  static enrichNotification(notification) {
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
  }
}
