import { CheckCircle, Users } from "lucide-react";
import styles from "./ProjectCard.module.css";

const ProjectStats = ({ project }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <CheckCircle className={styles.statIcon} />
        <span>
          {project.completedTasks || 0}/{project.totalTasks || 0} tasks
        </span>
      </div>
      <div className={styles.stat}>
        <Users className={styles.statIcon} />
        <span>{project.memberCount || 0} members</span>
      </div>
    </div>
  );
};

export default ProjectStats;
