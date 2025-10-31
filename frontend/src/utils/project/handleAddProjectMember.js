import * as projectService from "../../services/projectService";
import toast from "react-hot-toast";

/**
 * Handle adding a member to the project
 */
const handleAddProjectMember = async (
  workspaceId,
  projectId,
  userId,
  setShowModal,
  setSubmitting,
  refreshCallback
) => {
  setSubmitting(true);
  try {
    await projectService.addProjectMember(workspaceId, projectId, userId);
    toast.success("Member added to project");
    setShowModal(false);
    if (refreshCallback) {
      refreshCallback();
    }
  } catch (error) {
    console.error("Error adding project member:", error);
    toast.error(error.response?.data?.message || "Failed to add member");
  } finally {
    setSubmitting(false);
  }
};

export default handleAddProjectMember;
