import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  WorkspaceMenu,
  WorkspaceIcon,
  WorkspaceStats,
} from "./workspaceCardModule";

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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleClick}
    >
      <div ref={menuRef}>
        <WorkspaceMenu
          showMenu={showMenu}
          onToggle={() => setShowMenu(!showMenu)}
          onEdit={(w) => {
            onEdit(w);
            setShowMenu(false);
          }}
          onDelete={(w) => {
            onDelete(w);
            setShowMenu(false);
          }}
          workspace={workspace}
        />
      </div>

      <div className="flex items-start gap-4">
        <WorkspaceIcon />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
            {workspace.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">
            {workspace.description || "No description"}
          </p>
          <WorkspaceStats workspace={workspace} />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
