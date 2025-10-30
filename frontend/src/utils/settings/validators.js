export const validateWorkspaceSettings = (formData) => {
  const errors = {};
  if (!formData.name.trim()) {
    errors.name = "Workspace name is required";
  }
  return errors;
};
