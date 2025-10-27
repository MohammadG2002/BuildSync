import {
  FolderKanban,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  CheckCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getStatusColor } from "../../utils/helpers";

const ProjectCard = ({ project, onEdit, onDelete, onClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e) => {
    if (
      e.target.closest(".menu-button") ||
      e.target.closest(".menu-dropdown")
    ) {
      return;
    }
    onClick?.(project);
  };

  const statusColors = {
    active: "bg-green-100 text-green-700",
    on_hold: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    archived: "bg-gray-100 text-gray-700",
  };

  const progress =
    project.totalTasks > 0
      ? Math.round((project.completedTasks / project.totalTasks) * 100)
      : 0;

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleClick}
    >
      {/* Menu Button */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          className="menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="menu-dropdown absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FolderKanban className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate pr-8">
              {project.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {project.description || "No description"}
          </p>
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
              statusColors[project.status]
            }`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          <span>
            {project.completedTasks || 0}/{project.totalTasks || 0} tasks
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{project.memberCount || 0} members</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
