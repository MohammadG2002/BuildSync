import styles from "./ActivityFeed.module.css";

const ActivityIcon = ({ type, config }) => {
  const Icon = config.icon;

  return (
    <div className={`${styles.iconContainer} ${config.bgColor}`}>
      <Icon className={`${styles.icon} ${config.color}`} />
    </div>
  );
};

export default ActivityIcon;
