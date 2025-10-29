import { User, Calendar, CheckCircle } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./TaskDetailsModal.module.css";

const MetadataGrid = ({ task }) => {
  return (
    <div className={styles.metadataGrid}>
      {/* Assignee */}
      <div>
        <div className={styles.metadataItemHeader}>
          <User className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Assignee</h3>
        </div>
        {task.assignedTo || task.assignee ? (
          <div className={styles.userInfo}>
            <div
              className={styles.userAvatar}
              style={{
                backgroundColor: generateColor(
                  task.assignedTo?.name || task.assignee?.name || "Unassigned"
                ),
              }}
            >
              {getInitials(task.assignedTo?.name || task.assignee?.name || "U")}
            </div>
            <div>
              <p className={styles.userName}>
                {task.assignedTo?.name || task.assignee?.name}
              </p>
              <p className={styles.userEmail}>
                {task.assignedTo?.email || task.assignee?.email}
              </p>
            </div>
          </div>
        ) : (
          <p className={styles.metadataTextMuted}>Unassigned</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <div className={styles.metadataItemHeader}>
          <Calendar className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Due Date</h3>
        </div>
        <p className={styles.metadataText}>
          {task.dueDate ? formatDate(task.dueDate) : "No due date"}
        </p>
      </div>

      {/* Created By */}
      <div>
        <div className={styles.metadataItemHeader}>
          <User className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Created By</h3>
        </div>
        {task.createdBy ? (
          <div className={styles.userInfo}>
            <div
              className={styles.userAvatar}
              style={{
                backgroundColor: generateColor(task.createdBy.name || "U"),
              }}
            >
              {getInitials(task.createdBy.name || "U")}
            </div>
            <div>
              <p className={styles.userName}>{task.createdBy.name}</p>
              <p className={styles.userEmail}>{task.createdBy.email}</p>
            </div>
          </div>
        ) : (
          <p className={styles.metadataTextMuted}>Unknown</p>
        )}
      </div>

      {/* Completed At */}
      {task.completedAt && (
        <div>
          <div className={styles.metadataItemHeader}>
            <CheckCircle className={styles.metadataIcon} />
            <h3 className={styles.metadataItemTitle}>Completed At</h3>
          </div>
          <p className={styles.metadataText}>{formatDate(task.completedAt)}</p>
        </div>
      )}
    </div>
  );
};

export default MetadataGrid;
