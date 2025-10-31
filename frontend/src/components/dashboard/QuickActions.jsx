import Button from "../common/Button";
import { Plus, Briefcase, Users } from "lucide-react";
import styles from "./Dashboard.module.css";

const QuickActions = ({ onNavigate }) => {
  return (
    <div className={styles.quickActions}>
      <Button
        variant="outline"
        className={styles.quickActionButton}
        onClick={() => onNavigate("/app/workspaces")}
      >
        <Plus className={styles.quickActionIcon} />
        Create Workspace
      </Button>
      <Button
        variant="outline"
        className={styles.quickActionButton}
        onClick={() => onNavigate("/app/workspaces")}
      >
        <Briefcase className={styles.quickActionIcon} />
        New Project
      </Button>
      <Button
        variant="outline"
        className={styles.quickActionButton}
        onClick={() => onNavigate("/app/chat")}
      >
        <Users className={styles.quickActionIcon} />
        Invite Members
      </Button>
    </div>
  );
};

export default QuickActions;
