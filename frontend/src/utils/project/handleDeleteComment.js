import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

const handleDeleteComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.deleteComment(
      workspaceId,
      projectId,
      taskId,
      commentId
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
    toast.success("Comment deleted");
  } catch (error) {
    console.error("Failed to delete comment:", error);
    toast.error(error?.message || "Failed to delete comment");
  }
};

export default handleDeleteComment;
