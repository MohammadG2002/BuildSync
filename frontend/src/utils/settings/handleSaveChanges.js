import toast from "react-hot-toast";
import { validateWorkspaceSettings } from "./validators";

/**
 * Handle save workspace settings
 */
const handleSaveChanges = async (
  e,
  formData,
  setErrors,
  updateWorkspace,
  workspaceId,
  setLoading
) => {
  e.preventDefault();

  const newErrors = validateWorkspaceSettings(formData);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    await updateWorkspace(workspaceId, formData);
    toast.success("Workspace settings updated successfully!");
  } catch (error) {
    console.error("Error updating workspace:", error);
    toast.error("Failed to update workspace settings");
  } finally {
    setLoading(false);
  }
};

export default handleSaveChanges;
