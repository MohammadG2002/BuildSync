import { ChevronDown } from "lucide-react";
import styles from "./WorkspaceSelectorButton.module.css";

const WorkspaceSelectorButton = ({ currentWorkspace, onClick }) => {
  return (
    <button onClick={onClick} className={styles.workspaceButton}>
      <span className={styles.workspaceName}>
        {currentWorkspace?.name || "Select Workspace"}
      </span>
      <ChevronDown className={styles.chevronIcon} />
    </button>
  );
};

export default WorkspaceSelectorButton;
