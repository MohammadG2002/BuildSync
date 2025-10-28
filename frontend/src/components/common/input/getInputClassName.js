// Get input className based on props
const getInputClassName = (Icon, error, className) => {
  const baseClasses =
    "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100";
  const paddingClass = Icon ? "pl-10" : "";
  const borderClass = error
    ? "border-red-500 dark:border-red-400"
    : "border-gray-300 dark:border-gray-600";

  return `${baseClasses} ${paddingClass} ${borderClass} ${className}`;
};

export default getInputClassName;
