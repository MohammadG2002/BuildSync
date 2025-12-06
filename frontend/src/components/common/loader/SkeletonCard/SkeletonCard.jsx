import styles from "./SkeletonCard.module.css";

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonFlex}>
      <div className={styles.skeletonIcon}></div>
      <div className={styles.skeletonContent}>
        <div
          className={`${styles.skeletonLine} ${styles.skeletonWidth75}`}
        ></div>
        <div
          className={`${styles.skeletonLineSmall} ${styles.skeletonWidth50}`}
        ></div>
        <div className={styles.skeletonBadgeContainer}>
          <div className={styles.skeletonBadge}></div>
          <div className={styles.skeletonBadge}></div>
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
