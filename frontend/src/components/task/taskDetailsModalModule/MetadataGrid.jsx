import { User, Calendar, CheckCircle } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./TaskDetailsModal.module.css";

const MetadataGrid = ({ task }) => {
  return (
    <div className={styles.metadataGrid}>
      {/* Assignees */}
      <div>
        <div className={styles.metadataItemHeader}>
          <User className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Assignees</h3>
        </div>
        {task.assignedTo && task.assignedTo.length > 0 ? (
          <div className={styles.assigneesList}>
            {task.assignedTo.map((assignee, index) => (
              <div
                key={assignee._id || assignee.id || index}
                className={styles.userInfo}
              >
                <div
                  className={styles.userAvatar}
                  style={{
                    backgroundColor: generateColor(
                      assignee?.name || "Unknown User"
                    ),
                  }}
                >
                  {getInitials(assignee?.name || "U")}
                </div>
                <div>
                  <p className={styles.userName}>
                    {assignee?.name || "Unknown User"}
                  </p>
                  <p className={styles.userEmail}>
                    {assignee?.email || "No email"}
                  </p>
                </div>
              </div>
            ))}
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
