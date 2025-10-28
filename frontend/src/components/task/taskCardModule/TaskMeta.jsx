import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import { statusColors } from "./statusColors";
import { priorityColors, priorityDots } from "./priorityColors";

const TaskMeta = ({ task }) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Status Badge */}
      <span
        className={`px-2 py-1 text-xs font-medium rounded border ${
          statusColors[task.status]
        }`}
      >
        {task.status.replace(/-/g, " ")}
      </span>

      {/* Priority */}
      <div className="flex items-center gap-1">
        <div
          className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`}
        ></div>
        <span
          className={`text-xs font-medium ${priorityColors[task.priority]}`}
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
  );
};

export default TaskMeta;
