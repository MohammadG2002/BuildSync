import { User, Calendar, CheckCircle } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";

const MetadataGrid = ({ task }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Assignee */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Assignee
          </h3>
        </div>
        {task.assignedTo || task.assignee ? (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{
                backgroundColor: generateColor(
                  task.assignedTo?.name || task.assignee?.name || "Unassigned"
                ),
              }}
            >
              {getInitials(task.assignedTo?.name || task.assignee?.name || "U")}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {task.assignedTo?.name || task.assignee?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.assignedTo?.email || task.assignee?.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Unassigned</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Due Date
          </h3>
        </div>
        <p className="text-sm text-gray-900 dark:text-gray-100">
          {task.dueDate ? formatDate(task.dueDate) : "No due date"}
        </p>
      </div>

      {/* Created By */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Created By
          </h3>
        </div>
        {task.createdBy ? (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
              style={{
                backgroundColor: generateColor(task.createdBy.name || "U"),
              }}
            >
              {getInitials(task.createdBy.name || "U")}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {task.createdBy.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.createdBy.email}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Unknown</p>
        )}
      </div>

      {/* Completed At */}
      {task.completedAt && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Completed At
            </h3>
          </div>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            {formatDate(task.completedAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MetadataGrid;
