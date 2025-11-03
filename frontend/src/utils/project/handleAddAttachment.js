import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle adding attachment to task
 */
const handleAddAttachment = async (
  file,
  workspaceId,
  projectId,
  taskId,
  tasks,
  setTasks,
  setSelectedTask,
  section
) => {
  try {
    const updatedTask = await taskService.addAttachment(
      workspaceId,
      projectId,
      taskId,
      file,
      section ? { section } : undefined
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
    toast.success("Attachment added successfully!");
  } catch (error) {
    console.error("Error adding attachment:", error);
    toast.error("Failed to add attachment");
    throw error;
  }
};

export default handleAddAttachment;
