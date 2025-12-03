import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationFooter from "./NotificationFooter";
import styles from "./NotificationBell.module.css";

const NotificationDropdown = ({
  notifications,
  unreadCount,
  isConnected,
  onMarkAllAsRead,
  onNotificationClick,
  onDelete,
  onViewAll,
}) => {
  return (
    <div className={styles.dropdown}>
      <NotificationHeader
        unreadCount={unreadCount}
        isConnected={isConnected}
        onMarkAllAsRead={onMarkAllAsRead}
      />

      {notifications.length > 0 ? (
        <>
          <NotificationList
            notifications={notifications}
            onNotificationClick={onNotificationClick}
            onDelete={onDelete}
          />
          <NotificationFooter onClick={onViewAll} />
        </>
      ) : (
        <NotificationEmptyState />
      )}
    </div>
  );
};

export default NotificationDropdown;
