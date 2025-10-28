import getResultIcon from "./getResultIcon";

const SearchResultItem = ({ result, onClick }) => {
  const Icon = getResultIcon(result.type);

  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
          {result.name || result.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
          {result.workspace || result.project || result.role || result.type}
        </p>
      </div>
      <span className="text-xs text-gray-400 capitalize">{result.type}</span>
    </button>
  );
};

export default SearchResultItem;
