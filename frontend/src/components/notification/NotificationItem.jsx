import { getRelativeTime } from "../../utils/helpers";
import {
  getNotificationIcon,
  NotificationDeleteButton,
  NotificationUnreadIndicator,
} from "./notificationItemModule";
import styles from "./notificationBellModule/NotificationBell.module.css";

const NotificationItem = ({ notification, onClick, onDelete }) => {
  const itemClass = notification.read
    ? styles.item
    : `${styles.item} ${styles.itemUnread}`;

  return (
    <div className={itemClass} onClick={onClick}>
      <div className={styles.itemContent}>
        <div className={styles.itemIcon}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className={styles.itemBody}>
          <div className={styles.itemTop}>
            <span className={styles.itemTitle}>{notification.title}</span>
            <NotificationDeleteButton onDelete={onDelete} />
          </div>
          <p className={styles.itemMessage}>{notification.message}</p>
          <span className={styles.itemTime}>
            {getRelativeTime(notification.timestamp)}
          </span>
        </div>
        {!notification.read && <NotificationUnreadIndicator />}
      </div>
    </div>
  );
};

export default NotificationItem;
