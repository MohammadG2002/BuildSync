import { Bell } from "lucide-react";
import styles from "./NotificationBell.module.css";

const NotificationEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <Bell className={styles.emptyIcon} />
      <p>No notifications</p>
    </div>
  );
};

export default NotificationEmptyState;
