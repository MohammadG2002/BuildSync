import toast from "react-hot-toast";
import * as taskService from "../../services/taskService";

/**
 * Handle task restoration
 */
const handleRestoreTask = async (
  selectedTask,
  archivedTasks,
  setArchivedTasks,
  setShowRestoreModal,
  setSelectedTask,
  setRestoring,
  workspaceId,
  projectId
) => {
  setRestoring(true);
  try {
    const taskId = selectedTask._id || selectedTask.id;
    if (!taskId) throw new Error("Missing task id");
    await taskService.restoreTask(workspaceId, projectId, taskId);
    // Remove from local archived list
    setArchivedTasks(archivedTasks.filter((t) => (t._id || t.id) !== taskId));
    setShowRestoreModal(false);
    setSelectedTask(null);
    toast.success("Task restored successfully!");
  } catch (error) {
    console.error("Error restoring task:", error);
    toast.error("Failed to restore task");
  } finally {
    setRestoring(false);
  }
};

export default handleRestoreTask;
