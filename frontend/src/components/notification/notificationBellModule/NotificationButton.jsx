import { Bell, Wifi, WifiOff } from "lucide-react";

const NotificationButton = ({ unreadCount, isConnected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
      title={
        isConnected
          ? "Real-time notifications active"
          : "Notifications (offline)"
      }
    >
      <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />

      {/* Connection indicator */}
      <span
        className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
          isConnected ? "bg-green-500" : "bg-gray-400"
        }`}
        title={isConnected ? "Connected" : "Disconnected"}
      />

      {/* Unread count */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
