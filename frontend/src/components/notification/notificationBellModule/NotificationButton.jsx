import { Bell } from "lucide-react";
import styles from "./NotificationBell.module.css";

const NotificationButton = ({ unreadCount, isConnected, onClick }) => {
  const connectionClass = isConnected
    ? styles.connectionIndicatorConnected
    : styles.connectionIndicatorDisconnected;

  return (
    <button
      onClick={onClick}
      className={styles.button}
      title={
        isConnected
          ? "Real-time notifications active"
          : "Notifications (offline)"
      }
    >
      <Bell className={styles.bellIcon} />

      {/* Connection indicator */}
      <span
        className={`${styles.connectionIndicator} ${connectionClass}`}
        title={isConnected ? "Connected" : "Disconnected"}
      />

      {/* Unread count */}
      {unreadCount > 0 && (
        <span className={styles.unreadBadge}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
