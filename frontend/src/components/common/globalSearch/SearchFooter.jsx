const SearchFooter = () => {
  return (
    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
            ↑↓
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
            ↵
          </kbd>
          Select
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
            ESC
          </kbd>
          Close
        </span>
      </div>
    </div>
  );
};

export default SearchFooter;
