/**
 * Handle workspace deletion
 */
const handleDelete = async (
  selectedWorkspace,
  deleteWorkspace,
  setShowDeleteModal,
  setSelectedWorkspace,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await deleteWorkspace(selectedWorkspace.id);
    setShowDeleteModal(false);
    setSelectedWorkspace(null);
  } catch (error) {
    console.error("Error deleting workspace:", error);
  } finally {
    setSubmitting(false);
  }
};

export default handleDelete;
