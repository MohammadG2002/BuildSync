import {
  Briefcase,
  Users,
  FolderKanban,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WorkspaceCard = ({ workspace, onEdit, onDelete }) => {
  const navigate = useNavigate();
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
    // Don't navigate if clicking on menu button or menu items
    if (
      e.target.closest(".menu-button") ||
      e.target.closest(".menu-dropdown")
    ) {
      return;
    }
    navigate(`/app/workspaces/${workspace.id}`);
  };

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
                onEdit(workspace);
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
                onDelete(workspace);
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
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {workspace.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {workspace.description || "No description"}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{workspace.memberCount || 0} members</span>
            </div>
            <div className="flex items-center gap-1">
              <FolderKanban className="w-4 h-4" />
              <span>{workspace.projectCount || 0} projects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
