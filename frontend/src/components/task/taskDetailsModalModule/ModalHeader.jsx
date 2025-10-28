import { X } from "lucide-react";
import { statusColors, priorityColors } from "./colors";

const ModalHeader = ({ task, onClose, onStatusChange, onPriorityChange }) => {
  return (
    <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex-1 pr-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {task.title}
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={`px-3 py-1 text-sm font-medium rounded border cursor-pointer ${
              statusColors[task.status]
            }`}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Dropdown */}
          <select
            value={task.priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className={`px-3 py-1 text-sm font-medium rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer flex items-center gap-1 ${
              priorityColors[task.priority]
            }`}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
};

export default ModalHeader;
