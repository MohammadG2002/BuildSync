import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task archiving
 */
const handleArchiveTask = async (
  workspaceId,
  projectId,
  selectedTask,
  tasks,
  setTasks,
  setShowArchiveModal,
  setSelectedTask,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await taskService.archiveTask(workspaceId, projectId, selectedTask._id);
    // Remove from active tasks list
    setTasks(tasks.filter((t) => t._id !== selectedTask._id));
    setShowArchiveModal(false);
    setSelectedTask(null);
    toast.success("Task archived successfully!");
  } catch (error) {
    console.error("Error archiving task:", error);
    toast.error("Failed to archive task");
  } finally {
    setSubmitting(false);
  }
};

export default handleArchiveTask;
