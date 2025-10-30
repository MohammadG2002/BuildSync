import * as taskService from "../../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle task details update
 */
const handleTaskDetailsUpdate = async (
  updatedTaskData,
  workspaceId,
  projectId,
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.updateTask(
      workspaceId,
      projectId,
      updatedTaskData._id,
      updatedTaskData
    );
    setTasks(
      tasks.map((t) => (t._id === updatedTaskData._id ? updatedTask : t))
    );
    setSelectedTask(updatedTask);
    toast.success("Task updated successfully!");
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  }
};

export default handleTaskDetailsUpdate;
