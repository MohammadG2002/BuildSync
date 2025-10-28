// Get className for upload icon based on drag state
const getUploadIconClassName = (dragActive) => {
  const baseClasses = "w-12 h-12 mx-auto mb-4";
  const colorClasses = dragActive
    ? "text-primary-600"
    : "text-gray-400 dark:text-gray-500";

  return `${baseClasses} ${colorClasses}`;
};

export default getUploadIconClassName;
