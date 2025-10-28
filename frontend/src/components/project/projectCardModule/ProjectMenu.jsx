import { MoreVertical, Edit, Trash2 } from "lucide-react";

const ProjectMenu = ({ showMenu, onToggle, onEdit, onDelete, project }) => {
  return (
    <div className="absolute top-4 right-4">
      <button
        className="menu-button p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {showMenu && (
        <div className="menu-dropdown absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-700 dark:text-gray-300"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
            }}
            className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectMenu;
