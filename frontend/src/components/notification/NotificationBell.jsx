import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, Check, Wifi, WifiOff } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationItem from "./NotificationItem";

const NotificationBell = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  return (
    <div
      className="relative"
      ref={notificationRef}
      data-onboarding="notification-bell"
    >
      <button
        onClick={() => setShowNotifications(!showNotifications)}
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

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-in-top">
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
                <WifiOff
                  className="w-4 h-4 text-gray-400"
                  title="Offline mode"
                />
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                <p>No notifications</p>
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => {
                  navigate("/app/notifications");
                  setShowNotifications(false);
                }}
                className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
