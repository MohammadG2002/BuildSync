import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";
import styles from "./Dashboard.module.css";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h4 className={styles.projectName}>{project.name}</h4>
          <p className={styles.projectWorkspace}>
            {project?.workspace?.name || project?.workspaceName || ""}
          </p>
        </div>
        <span className={styles.projectStatus}>
          {String(project.status || "").trim()}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className={styles.projectProgress}
        title={
          typeof project.completedTasksCount === "number" &&
          typeof project.totalExcludingBlocked === "number"
            ? `Completed ${project.completedTasksCount} of ${project.totalExcludingBlocked}`
            : undefined
        }
      >
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>
            {Number(project.progress || 0)}%
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${Number(project.progress || 0)}%` }}
          ></div>
        </div>
        {typeof project.completedTasksCount === "number" &&
          typeof project.totalExcludingBlocked === "number" && (
            <div className={styles.progressMeta}>
              {project.completedTasksCount} of {project.totalExcludingBlocked}{" "}
              completed
            </div>
          )}
      </div>

      {/* Members and Due Date */}
      <div className={styles.projectFooter}>
        <div className={styles.projectMembers}>
          {(project.members || []).map((member, index) => (
            <div
              key={member.id || member._id || member.email || index}
              className={styles.memberAvatar}
              style={{
                backgroundColor: generateColor(
                  member?.name ||
                    member?.email ||
                    member?.username ||
                    member?.id ||
                    ""
                ),
              }}
              title={
                member?.name || member?.email || member?.username || "Member"
              }
            >
              {getInitials(
                member?.name || member?.email || member?.username || ""
              )}
            </div>
          ))}
        </div>
        <div className={styles.projectDueDate}>
          <Calendar className={styles.dueDateIcon} />
          <span>Due {formatDate(project.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
