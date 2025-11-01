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
    // Extract files from the form payload so we don't send them to the create endpoint
    const { files = [], assigneeIds, ...taskPayload } = formData || {};

    // 1) Create the task (JSON payload)
    let createdTask = await taskService.createTask(workspaceId, projectId, {
      ...taskPayload,
      assigneeIds,
    });

    // 2) If there are files, upload them one by one to the new task
    if (Array.isArray(files) && files.length > 0) {
      for (const file of files) {
        try {
          createdTask = await taskService.addAttachment(
            workspaceId,
            projectId,
            createdTask._id,
            file
          );
        } catch (uploadErr) {
          console.error("Attachment upload failed:", uploadErr);
          // Continue with other files; surface a non-blocking toast
          toast.error(`Failed to upload ${file?.name || "file"}`);
        }
      }
    }

    // 3) Update UI state with the final task (including any uploaded attachments)
    setTasks([...tasks, createdTask]);
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
