const ActivityFilters = ({ filter, onFilterChange }) => {
  const filterOptions = [
    { value: "all", label: "All Activity" },
    { value: "tasks", label: "Tasks" },
    { value: "projects", label: "Projects" },
    { value: "members", label: "Members" },
    { value: "files", label: "Files" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {filterOptions.map((filterOption) => (
        <button
          key={filterOption.value}
          onClick={() => onFilterChange(filterOption.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === filterOption.value
              ? "bg-primary-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {filterOption.label}
        </button>
      ))}
    </div>
  );
};

export default ActivityFilters;
