const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
