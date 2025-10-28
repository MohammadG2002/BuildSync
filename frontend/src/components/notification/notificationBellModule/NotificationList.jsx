import NotificationItem from "../NotificationItem";

const NotificationList = ({ notifications, onNotificationClick, onDelete }) => {
  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onDelete={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        />
      ))}
    </div>
  );
};

export default NotificationList;
