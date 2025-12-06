import { Plus, Briefcase } from "lucide-react";
import Card from "../../common/card/Card/Card";
import Button from "../../common/button/Button/Button";
import styles from "./EmptyWorkspacesState.module.css";

const EmptyWorkspacesState = ({ onCreateWorkspace }) => {
  return (
    <Card className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <Briefcase className={styles.emptyIconImage} />
      </div>
      <h3 className={styles.emptyTitle}>No workspaces yet</h3>
      <p className={styles.emptyDescription}>
        Create your first workspace to get started with your projects
      </p>
      <Button
        variant="primary"
        onClick={onCreateWorkspace}
        className={styles.emptyCreateButton}
      >
        <Plus className={styles.emptyCreateIcon} />
        Create Workspace
      </Button>
    </Card>
  );
};

export default EmptyWorkspacesState;
