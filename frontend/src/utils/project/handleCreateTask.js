import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task creation
 */
const handleCreateTask = async (
  formData,
  workspaceId,
  projectId,
  tasks,
  setTasks,
  setShowCreateModal,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    const newTask = await taskService.createTask(
      workspaceId,
      projectId,
      formData
    );
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
    toast.success("Task created successfully!");
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error("Failed to create task");
  } finally {
    setSubmitting(false);
  }
};

export default handleCreateTask;
