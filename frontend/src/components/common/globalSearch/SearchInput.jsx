import { Search, X } from "lucide-react";

const SearchInput = ({ inputRef, searchQuery, onChange, onClose }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={onChange}
          placeholder="Search workspaces, projects, tasks, members..."
          className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
