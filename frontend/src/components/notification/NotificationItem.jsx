import { getRelativeTime } from "../../utils/helpers";
import {
  getNotificationIcon,
  NotificationDeleteButton,
  NotificationUnreadIndicator,
} from "./notificationItemModule";

const NotificationItem = ({ notification, onClick, onDelete }) => {
  return (
    <div
      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all ${
        !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
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
            <NotificationDeleteButton onDelete={onDelete} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {notification.message}
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {getRelativeTime(notification.timestamp)}
          </span>
        </div>
        {!notification.read && <NotificationUnreadIndicator />}
      </div>
    </div>
  );
};

export default NotificationItem;
