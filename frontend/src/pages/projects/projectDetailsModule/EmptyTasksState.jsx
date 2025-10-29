import { CheckCircle, Plus } from "lucide-react";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import styles from "../ProjectDetails.module.css";

const EmptyTasksState = ({ filterStatus, onCreateTask }) => {
  return (
    <Card className={styles.emptyState}>
      <CheckCircle className={styles.emptyIcon} />
      <h3 className={styles.emptyTitle}>No tasks found</h3>
      <p className={styles.emptyDescription}>
        {filterStatus === "all"
          ? "Create your first task to get started"
          : `No tasks with status: ${filterStatus.replace("_", " ")}`}
      </p>
      <Button variant="primary" onClick={onCreateTask} className="gap-2">
        <Plus className="w-5 h-5" />
        Create Task
      </Button>
    </Card>
  );
};

export default EmptyTasksState;
