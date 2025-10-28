const ProjectProgress = ({ progress }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-gray-600 dark:text-gray-400">Progress</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProjectProgress;
