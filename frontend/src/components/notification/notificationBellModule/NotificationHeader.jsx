import { Wifi, WifiOff, Check } from "lucide-react";

const NotificationHeader = ({ unreadCount, isConnected, onMarkAllAsRead }) => {
  return (
    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
          Notifications
        </h3>
        {isConnected ? (
          <Wifi
            className="w-4 h-4 text-green-500"
            title="Real-time updates active"
          />
        ) : (
          <WifiOff className="w-4 h-4 text-gray-400" title="Offline mode" />
        )}
      </div>
      {unreadCount > 0 && (
        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
        >
          <Check className="w-3 h-3" />
          Mark all as read
        </button>
      )}
    </div>
  );
};

export default NotificationHeader;
