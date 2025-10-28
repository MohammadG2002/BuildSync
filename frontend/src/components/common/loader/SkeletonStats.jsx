const SkeletonStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonStats;
