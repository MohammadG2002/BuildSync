import { Archive, Calendar, RotateCcw } from "lucide-react";
import Button from "../common/Button";
import Card from "../common/Card";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";
import getStatusClass from "../../utils/archived/getStatusClass";
import getPriorityClass from "../../utils/archived/getPriorityClass";
import styles from "../../pages/archived/Archived.module.css";

const ArchivedTaskCard = ({ task, onRestoreClick }) => {
  return (
    <Card className={styles.taskCard}>
      <div className={styles.taskCardContent}>
        <div className={styles.taskCardMain}>
          <div className={styles.taskHeader}>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            <span className={getStatusClass(task.status)}>
              {task.status.replace("_", " ")}
            </span>
            <span className={getPriorityClass(task.priority)}>
              {task.priority.toUpperCase()}
            </span>
          </div>

          {task.description && (
            <p className={styles.taskDescription}>{task.description}</p>
          )}

          <div className={styles.taskMeta}>
            {task.assignee && (
              <div className={styles.taskAssignee}>
                <div
                  className={styles.assigneeAvatar}
                  style={{
                    backgroundColor: generateColor(task.assignee.name),
                  }}
                >
                  {getInitials(task.assignee.name)}
                </div>
                <span>{task.assignee.name}</span>
              </div>
            )}

            <div className={styles.taskDate}>
              <Archive className={styles.taskDateIcon} />
              <span>Archived {formatDate(task.archivedDate)}</span>
            </div>

            {task.completedDate && (
              <div className={styles.taskDate}>
                <Calendar className={styles.taskDateIcon} />
                <span>Completed {formatDate(task.completedDate)}</span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onRestoreClick(task)}
          className={styles.taskRestoreButton}
        >
          <RotateCcw className={styles.taskRestoreIcon} />
          Restore
        </Button>
      </div>
    </Card>
  );
};

export default ArchivedTaskCard;
