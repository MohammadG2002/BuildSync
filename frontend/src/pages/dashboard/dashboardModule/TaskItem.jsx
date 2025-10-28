import { Calendar } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import { priorityColors } from "./colors";

const TaskItem = ({ task }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-800 transition-colors cursor-pointer">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {}}
        className="w-5 h-5 text-primary-600 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500"
      />
      <div className="flex-1">
        <h4
          className={`font-medium text-gray-900 dark:text-gray-100 ${
            task.completed
              ? "line-through text-gray-500 dark:text-gray-400 dark:text-gray-500"
              : ""
          }`}
        >
          {task.title}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {task.project}
          </p>
          <span
            className={`text-xs font-medium ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
