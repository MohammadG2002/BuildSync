import styles from "./Loader.module.css";

const SkeletonStats = () => (
  <div className={styles.skeletonStats}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className={styles.skeletonStatCard}>
        <div className={styles.skeletonFlex}>
          <div className={styles.skeletonContent}>
            <div
              className={`${styles.skeletonLineSmall} ${styles.skeletonWidth25}`}
            ></div>
            <div
              className={`${styles.skeletonLineLarge} ${styles.skeletonWidth50}`}
            ></div>
            <div
              className={`${styles.skeletonLineSmall} ${styles.skeletonWidth75}`}
            ></div>
          </div>
          <div className={styles.skeletonIcon}></div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonStats;
