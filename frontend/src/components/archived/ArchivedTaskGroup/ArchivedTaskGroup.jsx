import { FolderKanban } from "lucide-react";
import ArchivedTaskCard from "../ArchivedTaskCard/ArchivedTaskCard";
import styles from "./ArchivedTaskGroup.module.css";

const ArchivedTaskGroup = ({ projectName, tasks, onRestoreClick }) => {
  return (
    <div className={styles.taskGroup}>
      <div className={styles.groupHeader}>
        <div className={styles.groupHeaderIcon}>
          <FolderKanban className={styles.groupHeaderIconImage} />
          <h2 className={styles.groupTitle}>
            {projectName}{" "}
            <span className={styles.groupCount}>({tasks.length})</span>
          </h2>
        </div>
      </div>
      <div className={styles.taskList}>
        {tasks.map((task) => (
          <ArchivedTaskCard
            key={task.id}
            task={task}
            onRestoreClick={onRestoreClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ArchivedTaskGroup;
