import * as taskService from "../../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task status change
 */
const handleStatusChange = async (
  task,
  newStatus,
  workspaceId,
  projectId,
  tasks,
  setTasks
) => {
  try {
    const updatedTask = await taskService.updateTask(
      workspaceId,
      projectId,
      task._id,
      { status: newStatus }
    );
    setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
    toast.success(`Task marked as ${newStatus.replace(/-/g, " ")}`);
  } catch (error) {
    console.error("Error updating task status:", error);
    toast.error("Failed to update task status");
  }
};

export default handleStatusChange;
