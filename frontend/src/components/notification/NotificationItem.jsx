import { X } from "lucide-react";
import { getRelativeTime } from "../../utils/helpers";

const NotificationItem = ({ notification, onClick, onDelete }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task_assigned":
        return "📋";
      case "project_updated":
        return "📁";
      case "member_added":
        return "👥";
      case "mention":
        return "💬";
      case "message":
        return "✉️";
      case "deadline":
        return "⏰";
      case "comment":
        return "💭";
      default:
        return "🔔";
    }
  };

  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 cursor-pointer transition-all ${
        !notification.read ? "bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0 animate-bounce-once">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="font-medium text-sm text-gray-800 dark:text-gray-100">
              {notification.title}
            </span>
            <button
              onClick={onDelete}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 dark:bg-gray-700 transition-colors"
            >
              <X className="w-3 h-3 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 mb-1">{notification.message}</p>
          <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
            {getRelativeTime(notification.timestamp)}
          </span>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
