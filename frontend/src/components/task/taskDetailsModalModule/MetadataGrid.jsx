import { User, Calendar, CheckCircle, Link as LinkIcon } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import UserAvatar from "../../common/UserAvatar/UserAvatar";
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
                <UserAvatar
                  name={assignee?.name || "Unknown User"}
                  avatar={assignee?.avatar}
                  className={styles.userAvatar}
                />
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

      {/* Start & Due Dates */}
      <div>
        <div className={styles.metadataItemHeader}>
          <Calendar className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Dates</h3>
        </div>
        <p className={styles.metadataText}>
          {task.startDate ? formatDate(task.startDate) : "No start"}
          <span style={{ margin: "0 0.35rem", color: "#9ca3af" }}>→</span>
          {task.dueDate ? formatDate(task.dueDate) : "No due"}
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
            <UserAvatar
              name={task.createdBy.name}
              avatar={task.createdBy.avatar}
              className={styles.userAvatar}
            />
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

      {/* Dependencies */}
      <div>
        <div className={styles.metadataItemHeader}>
          <LinkIcon className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>Dependencies</h3>
        </div>
        {Array.isArray(task.dependencies) && task.dependencies.length > 0 ? (
          <ul className={styles.metadataList}>
            {task.dependencies.map((dep) => {
              const id = dep._id || dep.id || dep;
              const title = dep.title || "Untitled";
              const seq = dep.sequence ? `#${dep.sequence} ` : "";
              return (
                <li key={id} className={styles.metadataText}>
                  {seq}
                  {title}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.metadataTextMuted}>None</p>
        )}
      </div>
    </div>
  );
};

export default MetadataGrid;
