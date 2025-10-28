import WorkspaceDropdownItem from "./WorkspaceDropdownItem";

const WorkspaceDropdown = ({
  workspaces,
  currentWorkspace,
  onSelect,
  onCreateNew,
}) => {
  return (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
        Your Workspaces
      </div>
      <div className="max-h-64 overflow-y-auto">
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <WorkspaceDropdownItem
              key={workspace.id}
              workspace={workspace}
              isActive={currentWorkspace?.id === workspace.id}
              onClick={() => onSelect(workspace)}
            />
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            No workspaces available
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
        <button
          onClick={onCreateNew}
          className="w-full text-left px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          + Create New Workspace
        </button>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
