export const validateWorkspaceForm = (formData) => {
  const newErrors = {};
  if (!formData.name.trim()) {
    newErrors.name = "Workspace name is required";
  }
  return newErrors;
};
