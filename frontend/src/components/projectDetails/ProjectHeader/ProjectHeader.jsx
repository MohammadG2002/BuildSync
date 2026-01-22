import { Plus, ArrowLeft, Users } from "lucide-react";
import Button from "../../common/button/Button/Button";
import styles from "./ProjectHeader.module.css";

/**
 * ProjectHeader Component
 * Displays project title, navigation, and action buttons
 */
const ProjectHeader = ({
  project,
  onBackClick,
  onGanttClick,
  onNetworkClick,
  onAddMemberClick,
  onCreateTaskClick,
  isViewer,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <Button
          variant="ghost"
          onClick={onBackClick}
          className={styles.backButton}
        >
          <ArrowLeft className={styles.backIcon} />
        </Button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{project?.name || "Loading..."}</h1>
          <p className={styles.subtitle}>
            {project?.description || "Project details"}
          </p>
        </div>
      </div>
      <div className={styles.headerButtons}>
        <Button
          variant="outline"
          onClick={onGanttClick}
          className={styles.createTaskButton}
        >
          Gantt Chart
        </Button>
        <Button
          variant="outline"
          onClick={onNetworkClick}
          className={styles.createTaskButton}
        >
          Network Diagram
        </Button>
        <Button
          variant="secondary"
          onClick={onAddMemberClick}
          className={styles.addMemberButton}
        >
          <Users className={styles.addMemberIcon} />
          Members
        </Button>
        <Button
          variant="primary"
          onClick={onCreateTaskClick}
          className={styles.createTaskButton}
          disabled={isViewer}
          title={isViewer ? "Viewers cannot create tasks" : undefined}
        >
          <Plus className={styles.createTaskIcon} />
          New Task
        </Button>
      </div>
    </div>
  );
};

export default ProjectHeader;
