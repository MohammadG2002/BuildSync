import styles from "./NotificationBell.module.css";

const NotificationFooter = ({ onClick }) => {
  return (
    <div className={styles.footer}>
      <button onClick={onClick} className={styles.footerButton}>
        View all notifications
      </button>
    </div>
  );
};

export default NotificationFooter;
