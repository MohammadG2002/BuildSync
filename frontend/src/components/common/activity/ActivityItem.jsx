import ActivityIcon from "./ActivityIcon";
import { formatTimestamp } from "./utils";

const ActivityItem = ({ activity, config }) => {
  return (
    <div className="flex gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 p-3 -mx-3 rounded-lg transition-colors">
      {/* Icon */}
      <ActivityIcon type={activity.type} config={config} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-gray-600 dark:text-gray-400">
                {activity.description}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <time className="text-xs text-gray-500 dark:text-gray-500">
                {formatTimestamp(activity.timestamp)}
              </time>
              <span className="text-xs text-gray-400 dark:text-gray-600">
                •
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {config.label}
              </span>
            </div>
          </div>
          {/* User Avatar */}
          <img
            src={activity.user.avatar}
            alt={activity.user.name}
            className="w-6 h-6 rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
