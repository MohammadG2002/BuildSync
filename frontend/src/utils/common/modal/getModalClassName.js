// Get modal className based on size
const getModalClassName = (size, modalSizes) => {
  return `relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${modalSizes[size]} max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-scale-in`;
};

export default getModalClassName;
