import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task deletion
 */
const handleDeleteTask = async (
  workspaceId,
  projectId,
  selectedTask,
  tasks,
  setTasks,
  setShowDeleteModal,
  setSelectedTask,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await taskService.deleteTask(workspaceId, projectId, selectedTask._id);
    setTasks(tasks.filter((t) => t._id !== selectedTask._id));
    setShowDeleteModal(false);
    setSelectedTask(null);
    toast.success("Task deleted successfully!");
  } catch (error) {
    console.error("Error deleting task:", error);
    toast.error("Failed to delete task");
  } finally {
    setSubmitting(false);
  }
};

export default handleDeleteTask;
