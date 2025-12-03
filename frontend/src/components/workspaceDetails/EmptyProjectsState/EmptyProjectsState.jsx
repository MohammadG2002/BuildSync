import { FolderKanban, Plus } from "lucide-react";
import Card from "../../common/card/Card";
import Button from "../../common/button/Button";
import styles from "../../../pages/workspaces/WorkspaceDetails.module.css";

const EmptyProjectsState = ({ onCreateProject, canCreate = true }) => {
  return (
    <Card className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <FolderKanban className={styles.emptyIconImage} />
      </div>
      <h3 className={styles.emptyTitle}>No projects yet</h3>
      <p className={styles.emptyDescription}>
        Create your first project to start managing tasks
      </p>
      {canCreate && (
        <Button
          variant="primary"
          onClick={onCreateProject}
          className={styles.emptyCreateButton}
        >
          <Plus className={styles.emptyCreateIcon} />
          Create Project
        </Button>
      )}
    </Card>
  );
};

export default EmptyProjectsState;
