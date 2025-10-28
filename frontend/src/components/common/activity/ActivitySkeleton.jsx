const ActivitySkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
