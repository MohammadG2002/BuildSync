import styles from "./ProjectCard.module.css";

const ProjectProgress = ({ progress }) => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <span className={styles.progressLabel}>Progress</span>
        <span className={styles.progressValue}>{progress}%</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProjectProgress;
