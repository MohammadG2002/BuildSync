import NotificationItem from "../NotificationItem";
import styles from "./NotificationBell.module.css";

const NotificationList = ({ notifications, onNotificationClick, onDelete }) => {
  return (
    <div className={styles.list}>
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
