import * as taskService from "../../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle deleting attachment from task
 */
const handleDeleteAttachment = async (
  taskId,
  attachmentId,
  workspaceId,
  projectId,
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.deleteAttachment(
      workspaceId,
      projectId,
      taskId,
      attachmentId
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
    toast.success("Attachment deleted successfully!");
  } catch (error) {
    console.error("Error deleting attachment:", error);
    toast.error("Failed to delete attachment");
  }
};

export default handleDeleteAttachment;
