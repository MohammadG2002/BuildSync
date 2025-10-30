import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task update
 */
const handleUpdateTask = async (
  formData,
  workspaceId,
  projectId,
  selectedTask,
  tasks,
  setTasks,
  setShowEditModal,
  setSelectedTask,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    const updatedTask = await taskService.updateTask(
      workspaceId,
      projectId,
      selectedTask._id,
      formData
    );
    setTasks(tasks.map((t) => (t._id === selectedTask._id ? updatedTask : t)));
    setShowEditModal(false);
    setSelectedTask(null);
    toast.success("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  } finally {
    setSubmitting(false);
  }
};

export default handleUpdateTask;
