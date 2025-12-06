import styles from "./CardHeader.module.css";

const CardHeader = ({ title, action }) => {
  if (!title && !action) return null;

  return (
    <div className={styles.header}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default CardHeader;
