import toast from "react-hot-toast";

/**
 * Handle workspace deletion
 */
const handleDeleteWorkspace = async (
  deleteConfirmation,
  workspace,
  deleteWorkspace,
  workspaceId,
  setShowDeleteModal,
  navigate,
  setLoading
) => {
  if (deleteConfirmation !== workspace?.name) {
    toast.error("Please type the workspace name correctly to confirm");
    return;
  }

  setLoading(true);
  try {
    await deleteWorkspace(workspaceId);
    setShowDeleteModal(false);
    navigate("/app/workspaces");
    toast.success("Workspace deleted successfully");
  } catch (error) {
    console.error("Error deleting workspace:", error);
    toast.error("Failed to delete workspace");
  } finally {
    setLoading(false);
  }
};

export default handleDeleteWorkspace;
