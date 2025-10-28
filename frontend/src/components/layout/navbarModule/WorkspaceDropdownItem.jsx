const WorkspaceDropdownItem = ({ workspace, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        isActive
          ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
          : "text-gray-800 dark:text-gray-200"
      }`}
    >
      <div className="font-medium">{workspace.name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {workspace.description}
      </div>
    </button>
  );
};

export default WorkspaceDropdownItem;
