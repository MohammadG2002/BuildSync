import * as projectService from "../../../services/projectService";
import toast from "react-hot-toast";

/**
 * Handle project update
 */
const handleUpdateProject = async (
  formData,
  workspaceId,
  selectedProject,
  projects,
  setProjects,
  setShowEditModal,
  setSelectedProject,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    const updated = await projectService.updateProject(
      workspaceId,
      selectedProject.id,
      formData
    );
    setProjects(
      projects.map((p) => (p.id === selectedProject.id ? updated : p))
    );
    setShowEditModal(false);
    setSelectedProject(null);
    toast.success("Project updated successfully!");
  } catch (error) {
    console.error("Error updating project:", error);
    toast.error("Failed to update project");
  } finally {
    setSubmitting(false);
  }
};

export default handleUpdateProject;
