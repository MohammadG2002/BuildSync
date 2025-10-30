import * as projectService from "../../../services/projectService";
import toast from "react-hot-toast";

/**
 * Handle project creation
 */
const handleCreateProject = async (
  formData,
  workspaceId,
  projects,
  setProjects,
  setShowCreateModal,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    const newProject = await projectService.createProject(
      workspaceId,
      formData
    );
    setProjects([...projects, newProject]);
    setShowCreateModal(false);
    toast.success("Project created successfully!");
  } catch (error) {
    console.error("Error creating project:", error);
    toast.error("Failed to create project");
  } finally {
    setSubmitting(false);
  }
};

export default handleCreateProject;
