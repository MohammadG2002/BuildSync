export const validateForm = (formData) => {
  const newErrors = {};
  if (!formData.name.trim()) {
    newErrors.name = "Project name is required";
  }
  if (formData.startDate && formData.dueDate) {
    if (new Date(formData.startDate) > new Date(formData.dueDate)) {
      newErrors.dueDate = "Due date must be after start date";
    }
  }
  return newErrors;
};
