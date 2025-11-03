import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

const handleReactToComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  action, // 'like' | 'dislike' | 'clear'
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.reactToComment(
      workspaceId,
      projectId,
      taskId,
      commentId,
      action
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
  } catch (error) {
    console.error("Failed to react to comment:", error);
    toast.error(error?.message || "Failed to update reaction");
  }
};

export default handleReactToComment;
