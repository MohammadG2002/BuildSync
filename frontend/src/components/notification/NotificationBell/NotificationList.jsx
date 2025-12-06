import NotificationItem from "../NotificationItem/NotificationItem";
import styles from "./NotificationBell.module.css";

const NotificationList = ({ notifications, onNotificationClick, onDelete }) => {
  return (
    <div className={styles.list}>
      {notifications.map((notification, index) => (
        <NotificationItem
          key={
            notification._id ||
            notification.id ||
            `${notification.type || "notif"}-${
              notification.createdAt || ""
            }-${index}`
          }
          notification={notification}
          onClick={() => onNotificationClick(notification)}
          onDelete={(e) => {
            e.stopPropagation();
            onDelete(notification.id || notification._id);
          }}
        />
      ))}
    </div>
  );
};

export default NotificationList;
