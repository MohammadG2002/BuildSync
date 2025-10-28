import { Calendar } from "lucide-react";
import { formatDate } from "../../../utils/helpers";

const DeadlineItem = ({ deadline }) => {
  return (
    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 transition-colors cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {deadline.title}
        </h4>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded ${
            deadline.daysLeft <= 5
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
        >
          {deadline.daysLeft}d
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 dark:text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>{formatDate(deadline.dueDate)}</span>
        <span className="text-gray-400 dark:text-gray-500">•</span>
        <span className="capitalize">{deadline.type}</span>
      </div>
    </div>
  );
};

export default DeadlineItem;
