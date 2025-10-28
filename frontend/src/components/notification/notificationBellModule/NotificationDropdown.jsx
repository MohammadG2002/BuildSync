import NotificationHeader from "./NotificationHeader";
import NotificationList from "./NotificationList";
import NotificationEmptyState from "./NotificationEmptyState";
import NotificationFooter from "./NotificationFooter";

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
    <div className="absolute top-full right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-slide-in-top">
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
