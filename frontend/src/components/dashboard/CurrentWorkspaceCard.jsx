import Button from "../../../components/common/Button";
import { Briefcase, ArrowRight } from "lucide-react";
import styles from "./Dashboard.module.css";

const CurrentWorkspaceCard = ({ workspace, onSwitch }) => {
  if (!workspace) return null;

  return (
    <div>
      <div className={styles.workspaceInfo}>
        <div className={styles.workspaceIconContainer}>
          <Briefcase className={styles.workspaceIcon} />
        </div>
        <div className={styles.workspaceDetails}>
          <h3 className={styles.workspaceName}>{workspace.name}</h3>
          <p className={styles.workspaceMembers}>
            {workspace.memberCount || 0} members
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        className={styles.switchButton}
        onClick={onSwitch}
      >
        Switch Workspace
        <ArrowRight className={styles.switchButtonIcon} />
      </Button>
    </div>
  );
};

export default CurrentWorkspaceCard;
