import { MoreVertical, Edit, Trash2 } from "lucide-react";

const TaskMenu = ({ showMenu, onToggle, onEdit, onDelete, task }) => {
  return (
    <div className="relative">
      <button
        className="menu-button p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
      </button>

      {showMenu && (
        <div className="menu-dropdown absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors flex items-center gap-2 text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskMenu;
