// Get className for drop zone based on drag state
const getDropZoneClassName = (dragActive) => {
  const baseClasses =
    "border-2 border-dashed rounded-lg p-8 text-center transition-colors";
  const activeClasses =
    "border-primary-500 bg-primary-50 dark:bg-primary-900/20";
  const inactiveClasses =
    "border-gray-300 dark:border-gray-600 hover:border-gray-400";

  return `${baseClasses} ${dragActive ? activeClasses : inactiveClasses}`;
};

export default getDropZoneClassName;
