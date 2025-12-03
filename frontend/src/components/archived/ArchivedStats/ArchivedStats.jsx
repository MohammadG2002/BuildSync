import { Archive } from "lucide-react";
import Card from "../../common/card/Card";
import styles from "./ArchivedStats.module.css";

const ArchivedStats = ({ archivedTasks }) => {
  const completedCount = archivedTasks.filter(
    (t) => t.status === "done"
  ).length;
  const canceledCount = archivedTasks.filter((t) => t.status !== "done").length;

  return (
    <div className={styles.statsGrid}>
      <Card>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Total Archived</p>
            <p className={styles.statValue}>{archivedTasks.length}</p>
          </div>
          <Archive className={styles.statIcon} />
        </div>
      </Card>
      <Card>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Completed</p>
            <p className={`${styles.statValue} ${styles.statValueGreen}`}>
              {completedCount}
            </p>
          </div>
          <div
            className={`${styles.statIconWrapper} ${styles.statIconWrapperGreen}`}
          >
            <Archive className={styles.statIconInner} />
          </div>
        </div>
      </Card>
      <Card>
        <div className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>Canceled</p>
            <p className={`${styles.statValue} ${styles.statValueRed}`}>
              {canceledCount}
            </p>
          </div>
          <div
            className={`${styles.statIconWrapper} ${styles.statIconWrapperRed}`}
          >
            <Archive className={styles.statIconInner} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArchivedStats;
