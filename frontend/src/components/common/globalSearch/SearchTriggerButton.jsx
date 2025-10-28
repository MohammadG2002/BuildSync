import { Search } from "lucide-react";

const SearchTriggerButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
    >
      <Search className="w-4 h-4" />
      <span className="text-sm hidden md:inline">Search...</span>
      <kbd className="hidden md:inline px-2 py-0.5 text-xs bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">
        ⌘K
      </kbd>
    </button>
  );
};

export default SearchTriggerButton;
