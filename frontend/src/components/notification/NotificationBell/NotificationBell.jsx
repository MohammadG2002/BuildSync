import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../hooks/useNotifications";
import NotificationButton from "./NotificationButton";
import NotificationDropdown from "./NotificationDropdown";
import styles from "./NotificationBell.module.css";
import InviteRequestModal from "../InviteRequestModal/InviteRequestModal";

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
  const [inviteNotification, setInviteNotification] = useState(null);
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
      markAsRead(notification.id || notification._id);
    }
    if (notification.type === "workspace_invite") {
      setInviteNotification(notification);
    } else if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  return (
    <div
      className={styles.container}
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

      <InviteRequestModal
        notification={inviteNotification}
        isOpen={!!inviteNotification}
        onClose={() => setInviteNotification(null)}
        onHandled={() => {
          // After accept/decline, remove or mark the notification
          deleteNotification(inviteNotification?.id || inviteNotification?._id);
        }}
      />
    </div>
  );
};

export default NotificationBell;
