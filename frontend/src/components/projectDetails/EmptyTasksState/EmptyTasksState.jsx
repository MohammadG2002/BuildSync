import { CheckCircle, Plus } from "lucide-react";
import Card from "../../common/card/Card";
import Button from "../../common/button/Button";
import styles from "./EmptyTasksState.module.css";

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
      <Button
        variant="primary"
        onClick={onCreateTask}
        className={styles.emptyCreateButton}
      >
        <Plus className={styles.emptyCreateIcon} />
        Create Task
      </Button>
    </Card>
  );
};

export default EmptyTasksState;
