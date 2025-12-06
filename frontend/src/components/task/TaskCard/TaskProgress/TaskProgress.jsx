import { useEffect, useState } from "react";
import styles from "./TaskProgress.module.css";

// Live-updating progress bar that can react to window events without refreshing parent props
const TaskProgress = ({ taskId, subtasks = [] }) => {
  const [liveSubtasks, setLiveSubtasks] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      const { taskId: changedTaskId, subtasks: nextSubtasks } = e.detail || {};
      if (!changedTaskId || changedTaskId !== taskId) return;
      setLiveSubtasks(Array.isArray(nextSubtasks) ? nextSubtasks : []);
    };
    window.addEventListener("task:subtasksUpdated", handler);
    return () => window.removeEventListener("task:subtasksUpdated", handler);
  }, [taskId]);

  const data = Array.isArray(liveSubtasks) ? liveSubtasks : subtasks;
  const total = Array.isArray(data) ? data.length : 0;
  const completed = total > 0 ? data.filter((s) => s?.completed).length : 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Subtasks</span>
        <span className={styles.progressCounts}>
          {completed}/{total}
        </span>
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{ width: `${percent}%` }}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};

export default TaskProgress;
