import * as taskService from "../../services/taskService";

/**
 * Handle task click to view details
 */
const handleTaskClick = async (
  task,
  workspaceId,
  projectId,
  setSelectedTask,
  setShowDetailsModal
) => {
  try {
    // Fetch full task details with populated fields
    const fullTask = await taskService.getTaskById(
      workspaceId,
      projectId,
      task._id
    );
    setSelectedTask(fullTask);
    setShowDetailsModal(true);
  } catch (error) {
    console.error("Error fetching task details:", error);
    // Fall back to showing the task we have
    setSelectedTask(task);
    setShowDetailsModal(true);
  }
};

export default handleTaskClick;
