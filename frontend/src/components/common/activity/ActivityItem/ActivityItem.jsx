import ActivityIcon from "../ActivityIcon/ActivityIcon";
import { formatTimestamp } from "../../../../utils/common/activity/utils";
import styles from "./ActivityItem.module.css";

const ActivityItem = ({ activity, config }) => {
  return (
    <div className={styles.item}>
      {/* Icon */}
      <ActivityIcon type={activity.type} config={config} />

      {/* Content */}
      <div className={styles.itemContent}>
        <div className={styles.itemTop}>
          <div className={styles.itemTopLeft}>
            <p className={styles.itemText}>
              <span className={styles.itemUserName}>{activity.user.name}</span>{" "}
              <span className={styles.itemDescription}>
                {activity.description}
              </span>
            </p>
            <div className={styles.itemMeta}>
              <time className={styles.itemTime}>
                {formatTimestamp(activity.timestamp)}
              </time>
              <span className={styles.itemSeparator}>•</span>
              <span className={styles.itemLabel}>{config.label}</span>
            </div>
          </div>
          {/* User Avatar */}
          <img
            src={activity.user.avatar}
            alt={activity.user.name}
            className={styles.itemAvatar}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
