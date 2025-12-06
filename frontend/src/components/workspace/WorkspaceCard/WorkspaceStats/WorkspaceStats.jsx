import { Users, FolderKanban } from "lucide-react";
import styles from "./WorkspaceStats.module.css";

const WorkspaceStats = ({ workspace }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.stat}>
        <Users className={styles.statIcon} />
        <span>{workspace.memberCount || 0} members</span>
      </div>
      <div className={styles.stat}>
        <FolderKanban className={styles.statIcon} />
        <span>{workspace.projectCount || 0} projects</span>
      </div>
    </div>
  );
};

export default WorkspaceStats;
