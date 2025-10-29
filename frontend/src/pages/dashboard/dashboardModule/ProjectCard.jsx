import { Calendar } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./Dashboard.module.css";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h4 className={styles.projectName}>{project.name}</h4>
          <p className={styles.projectWorkspace}>{project.workspace}</p>
        </div>
        <span className={styles.projectStatus}>{project.status}</span>
      </div>

      {/* Progress Bar */}
      <div className={styles.projectProgress}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>{project.progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Members and Due Date */}
      <div className={styles.projectFooter}>
        <div className={styles.projectMembers}>
          {project.members.map((member) => (
            <div
              key={member.id}
              className={styles.memberAvatar}
              style={{
                backgroundColor: generateColor(member.name),
              }}
              title={member.name}
            >
              {getInitials(member.name)}
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
