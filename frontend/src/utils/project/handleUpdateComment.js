import * as taskService from "../../services/taskService";
import toast from "react-hot-toast";

const handleUpdateComment = async (
  workspaceId,
  projectId,
  taskId,
  commentId,
  content,
  tasks,
  setTasks,
  setSelectedTask
) => {
  try {
    const updatedTask = await taskService.updateComment(
      workspaceId,
      projectId,
      taskId,
      commentId,
      content
    );
    setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
    setSelectedTask(updatedTask);
    toast.success("Comment updated");
  } catch (error) {
    console.error("Failed to update comment:", error);
    toast.error(error?.message || "Failed to update comment");
  }
};

export default handleUpdateComment;
