import { FolderKanban } from "lucide-react";
import styles from "./ProjectHeader.module.css";

const ProjectHeader = ({ project }) => {
  const statusClasses = {
    active: styles.statusActive,
    planning: styles.statusPlanning,
    completed: styles.statusCompleted,
    on_hold: styles.statusOnHold,
  };

  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <FolderKanban className={styles.iconSvg} />
      </div>
      <div className={styles.headerContent}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{project.name}</h3>
        </div>
        <p className={styles.description}>
          {project.description || "No description"}
        </p>
        <span
          className={`${styles.statusBadge} ${
            statusClasses[project.status] || styles.statusActive
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
};

export default ProjectHeader;
