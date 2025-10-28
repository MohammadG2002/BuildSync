import { ChevronDown } from "lucide-react";

const WorkspaceSelectorButton = ({ currentWorkspace, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
        {currentWorkspace?.name || "Select Workspace"}
      </span>
      <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
    </button>
  );
};

export default WorkspaceSelectorButton;
