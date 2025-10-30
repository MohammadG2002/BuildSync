import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

/**
 * Handle adding comment to task
 */
const handleAddComment = async (
  taskId,
  commentContent,
  workspaceId,
  projectId,
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.addComment(
      workspaceId,
      projectId,
      taskId,
      commentContent
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
    toast.success("Comment added successfully!");
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
    throw error;
  }
};

export default handleAddComment;
