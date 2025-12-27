import { Calendar, MoreVertical, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./ProjectCard.module.css";

const ProjectCard = ({ project, onClick, onSettings }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const totalExcl =
    typeof project.totalExcludingBlocked === "number"
      ? project.totalExcludingBlocked
      : undefined;

  // Determine whether to show progress:
  // - If we know total excluding blocked, show only when > 0
  // - If unknown, show only when `project.progress` is a finite number
  const hasNumericProgress = Number.isFinite(Number(project.progress));
  const showProgress =
    totalExcl === undefined ? hasNumericProgress : totalExcl > 0;

  return (
    <div className={styles.projectCard} onClick={onClick}>
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h4 className={styles.projectName}>{project.name}</h4>
          <p className={styles.projectWorkspace}>
            {project?.workspace?.name || project?.workspaceName || ""}
          </p>
        </div>
        <div className={styles.projectHeaderRight}>
          <span className={styles.projectStatus}>
            {String(project.status || "").trim()}
          </span>
          <div
            ref={menuRef}
            className={`${styles.projectMenuContainer}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`menu-button ${styles.projectMenuButton}`}
              onClick={() => setShowMenu((s) => !s)}
              title="Project menu"
            >
              <MoreVertical className={styles.projectMenuIcon} />
            </button>
            {showMenu && (
              <div className={`menu-dropdown ${styles.projectMenuDropdown}`}>
                <button
                  className={styles.projectMenuItem}
                  onClick={() => {
                    setShowMenu(false);
                    onSettings?.(project);
                  }}
                >
                  <SettingsIcon className={styles.projectMenuItemIcon} />
                  <span>Settings</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
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
              {hasNumericProgress
                ? `${Math.round(Number(project.progress))}%`
                : "0%"}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${
                  hasNumericProgress
                    ? Math.max(0, Math.min(100, Number(project.progress)))
                    : 0
                }%`,
              }}
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
      )}

      {/* Members and Due Date */}
      <div className={styles.projectFooter}>
        <div className={styles.projectMembers}>
          {(project.members || []).map((member, index) => {
            const u = member?.user || member || {};
            const nameLike =
              u.name ||
              u.fullName ||
              u.username ||
              (u.email ? String(u.email).split("@")[0] : "");
            const colorSeed = nameLike || u.email || "User";
            const raw = getInitials(nameLike || u.email || "U");
            const initials = /^[A-Za-z]/.test(raw) ? raw.charAt(0) : "U";
            const title = u.name || u.username || u.email || "Member";
            const key = u.id || u._id || member.id || member._id || index;

            return (
              <div
                key={key}
                className={styles.memberAvatar}
                style={{ backgroundColor: generateColor(colorSeed) }}
                title={title}
              >
                {initials}
              </div>
            );
          })}
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
