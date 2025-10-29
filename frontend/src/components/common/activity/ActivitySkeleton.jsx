import styles from "./ActivityFeed.module.css";

const ActivitySkeleton = () => {
  return (
    <div className={styles.skeleton}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonIcon} />
          <div className={styles.skeletonContent}>
            <div
              className={`${styles.skeletonLine} ${styles.skeletonLineWide}`}
            />
            <div
              className={`${styles.skeletonLine} ${styles.skeletonLineNarrow}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
