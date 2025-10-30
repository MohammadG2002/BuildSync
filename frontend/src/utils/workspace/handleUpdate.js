/**
 * Handle workspace update
 */
const handleUpdate = async (
  formData,
  selectedWorkspace,
  updateWorkspace,
  setShowEditModal,
  setSelectedWorkspace,
  setSubmitting
) => {
  setSubmitting(true);
  try {
    await updateWorkspace(selectedWorkspace.id, formData);
    setShowEditModal(false);
    setSelectedWorkspace(null);
  } catch (error) {
    console.error("Error updating workspace:", error);
  } finally {
    setSubmitting(false);
  }
};

export default handleUpdate;
