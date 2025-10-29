import { Wifi, WifiOff, Check } from "lucide-react";
import styles from "./NotificationBell.module.css";

const NotificationHeader = ({ unreadCount, isConnected, onMarkAllAsRead }) => {
  const wifiIconClass = isConnected
    ? `${styles.wifiIcon} ${styles.wifiIconConnected}`
    : `${styles.wifiIcon} ${styles.wifiIconDisconnected}`;

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h3 className={styles.headerTitle}>Notifications</h3>
        {isConnected ? (
          <Wifi className={wifiIconClass} title="Real-time updates active" />
        ) : (
          <WifiOff className={wifiIconClass} title="Offline mode" />
        )}
      </div>
      {unreadCount > 0 && (
        <button onClick={onMarkAllAsRead} className={styles.markAllButton}>
          <Check className={styles.markAllIcon} />
          Mark all as read
        </button>
      )}
    </div>
  );
};

export default NotificationHeader;
