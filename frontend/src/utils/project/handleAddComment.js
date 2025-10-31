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
  setSelectedTask,
  attachmentFiles = []
) => {
  try {
    console.log("Adding comment with attachments:", {
      taskId,
      commentContent,
      attachmentFilesCount: attachmentFiles?.length || 0,
      attachmentFiles,
    });

    // First, add the comment
    const updatedTask = await taskService.addComment(
      workspaceId,
      projectId,
      taskId,
      commentContent
    );

    console.log("Comment added, updated task:", updatedTask);
    console.log(
      "New comment:",
      updatedTask.comments[updatedTask.comments.length - 1]
    );

    // If there are attachment files, upload them to the newly created comment
    if (attachmentFiles && attachmentFiles.length > 0) {
      console.log("Uploading attachments...");
      // Get the newly added comment (last one in the array)
      const newComment = updatedTask.comments[updatedTask.comments.length - 1];
      console.log("New comment ID:", newComment._id);

      // Upload each file to the comment
      let taskWithAttachments = updatedTask;
      for (const file of attachmentFiles) {
        console.log("Uploading file:", file.name);
        taskWithAttachments = await taskService.addCommentAttachment(
          workspaceId,
          projectId,
          taskId,
          newComment._id,
          file
        );
        console.log("File uploaded successfully");
      }

      // Update with the final task state
      setTasks(tasks.map((t) => (t._id === taskId ? taskWithAttachments : t)));
      setSelectedTask(taskWithAttachments);
      // Find the correct comment by ID after all attachments are uploaded
      const commentId = newComment._id;
      const finalComment = taskWithAttachments.comments.find(
        (c) => c._id === commentId
      );
      console.log("Final comment after attachments:", finalComment);
      console.log("Attachments array:", finalComment?.attachments);
    } else {
      // No attachments, just update with the comment
      setTasks(tasks.map((t) => (t._id === taskId ? updatedTask : t)));
      setSelectedTask(updatedTask);
    }

    toast.success("Comment added successfully!");
  } catch (error) {
    console.error("Error adding comment:", error);
    toast.error("Failed to add comment");
    throw error;
  }
};

export default handleAddComment;
