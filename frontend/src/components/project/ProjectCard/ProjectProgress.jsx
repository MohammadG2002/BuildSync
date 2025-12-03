import styles from "./ProjectCard.module.css";

const ProjectProgress = ({ progress }) => {
  const validProgress = Number.isFinite(progress) ? progress : 0;

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Progress</span>
        <span className={styles.progressValue}>{validProgress}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${validProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProjectProgress;
