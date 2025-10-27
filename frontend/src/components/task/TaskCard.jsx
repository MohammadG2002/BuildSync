import {
  CheckCircle,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  User,
  Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, onClick }) => {
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
      e.target.closest(".menu-dropdown") ||
      e.target.closest(".checkbox-wrapper")
    ) {
      return;
    }
    onClick?.(task);
  };

  const statusColors = {
    todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    in_progress: "bg-blue-100 text-blue-700 border-blue-300",
    in_review: "bg-yellow-100 text-yellow-700 border-yellow-300",
    done: "bg-green-100 text-green-700 border-green-300",
  };

  const priorityColors = {
    low: "text-gray-600 dark:text-gray-400 dark:text-gray-500",
    medium: "text-blue-600",
    high: "text-orange-600",
    urgent: "text-red-600",
  };

  const priorityDots = {
    low: "bg-gray-400",
    medium: "bg-blue-400",
    high: "bg-orange-400",
    urgent: "bg-red-400",
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="checkbox-wrapper pt-1">
          <input
            type="checkbox"
            checked={task.status === "done"}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange?.(task, e.target.checked ? "done" : "todo");
            }}
            className="w-5 h-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 cursor-pointer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`text-base font-semibold text-gray-900 dark:text-gray-100 ${
                task.status === "done" ? "line-through text-gray-500 dark:text-gray-400 dark:text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>

            {/* Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                className="menu-button p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400 dark:text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="menu-dropdown absolute top-full right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                      setShowMenu(false);
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
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-3 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Status Badge */}
            <span
              className={`px-2 py-1 text-xs font-medium rounded border ${
                statusColors[task.status]
              }`}
            >
              {task.status.replace("_", " ")}
            </span>

            {/* Priority */}
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  priorityDots[task.priority]
                }`}
              ></div>
              <span
                className={`text-xs font-medium ${
                  priorityColors[task.priority]
                }`}
              >
                {task.priority}
              </span>
            </div>

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: generateColor(task.assignee.name) }}
                >
                  {getInitials(task.assignee.name)}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">
                  {task.assignee.name}
                </span>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
