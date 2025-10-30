/**
 * Handle workspace creation
 */
const handleCreate = async (
  formData,
  createWorkspace,
  setShowCreateModal,
  setSubmitting,
  navigate
) => {
  setSubmitting(true);
  try {
    const workspace = await createWorkspace(formData);
    setShowCreateModal(false);
    navigate(`/app/workspaces/${workspace.id}`);
  } catch (error) {
    console.error("Error creating workspace:", error);
  } finally {
    setSubmitting(false);
  }
};

export default handleCreate;
