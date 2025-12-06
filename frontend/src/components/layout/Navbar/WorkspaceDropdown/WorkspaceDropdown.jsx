import WorkspaceDropdownItem from "../WorkspaceDropdownItem/WorkspaceDropdownItem";
import styles from "./WorkspaceDropdown.module.css";

const WorkspaceDropdown = ({
  workspaces,
  currentWorkspace,
  onSelect,
  onCreateNew,
}) => {
  return (
    <div className={styles.workspaceDropdown}>
      <div className={styles.workspaceDropdownHeader}>Your Workspaces</div>
      <div className={styles.workspaceList}>
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <WorkspaceDropdownItem
              key={workspace.id}
              workspace={workspace}
              isActive={currentWorkspace?.id === workspace.id}
              onClick={() => onSelect(workspace)}
            />
          ))
        ) : (
          <div className={styles.workspaceEmptyState}>
            No workspaces available
          </div>
        )}
      </div>
      <div className={styles.workspaceDropdownDivider}>
        <button onClick={onCreateNew} className={styles.workspaceCreateButton}>
          + Create New Workspace
        </button>
      </div>
    </div>
  );
};

export default WorkspaceDropdown;
