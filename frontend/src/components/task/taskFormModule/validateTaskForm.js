export const validateTaskForm = (formData) => {
  const newErrors = {};
  if (!formData.title.trim()) {
    newErrors.title = "Task title is required";
  }
  return newErrors;
};
