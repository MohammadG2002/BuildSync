import { Filter } from "lucide-react";

const FilterButtons = ({ filterStatus, onFilterChange }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "In Review" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Status:
        </span>
      </div>
      <div className="flex gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === filter.value
                ? "bg-primary-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-700"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
