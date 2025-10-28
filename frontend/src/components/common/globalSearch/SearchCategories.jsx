import getResultIcon from "./getResultIcon";

const SearchCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  results,
}) => {
  return (
    <div className="flex gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
      {categories.map((category) => {
        const Icon = getResultIcon(category.id);
        const count =
          category.id === "all" ? 0 : results[category.id]?.length || 0;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category.id
                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{category.label}</span>
            {count > 0 && (
              <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SearchCategories;
