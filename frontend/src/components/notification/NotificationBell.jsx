import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../hooks/useNotifications";
import {
  NotificationButton,
  NotificationDropdown,
} from "./notificationBellModule";

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
      <NotificationButton
        unreadCount={unreadCount}
        isConnected={isConnected}
        onClick={() => setShowNotifications(!showNotifications)}
      />

      {showNotifications && (
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isConnected={isConnected}
          onMarkAllAsRead={markAllAsRead}
          onNotificationClick={handleNotificationClick}
          onDelete={deleteNotification}
          onViewAll={() => {
            navigate("/app/notifications");
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
};

export default NotificationBell;
