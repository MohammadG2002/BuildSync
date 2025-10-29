import { FolderKanban, Plus } from "lucide-react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import styles from "../WorkspaceDetails.module.css";

const EmptyProjectsState = ({ onCreateProject }) => {
  return (
    <Card className={styles.emptyState}>
      <div className={styles.emptyIcon}>
        <FolderKanban className="w-8 h-8" />
      </div>
      <h3 className={styles.emptyTitle}>No projects yet</h3>
      <p className={styles.emptyDescription}>
        Create your first project to start managing tasks
      </p>
      <Button variant="primary" onClick={onCreateProject} className="gap-2">
        <Plus className="w-5 h-5" />
        Create Project
      </Button>
    </Card>
  );
};

export default EmptyProjectsState;
