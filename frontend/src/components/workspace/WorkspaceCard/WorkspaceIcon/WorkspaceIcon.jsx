import { Briefcase } from "lucide-react";
import styles from "./WorkspaceIcon.module.css";

const WorkspaceIcon = () => {
  return (
    <div className={styles.icon}>
      <Briefcase className={styles.iconSvg} />
    </div>
  );
};

export default WorkspaceIcon;
