import styles from "./WorkspaceDropdownItem.module.css";

const WorkspaceDropdownItem = ({ workspace, isActive, onClick }) => {
  const buttonClasses = [
    styles.workspaceItem,
    isActive ? styles.workspaceItemActive : styles.workspaceItemDefault,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClick} className={buttonClasses}>
      <div className={styles.workspaceItemName}>{workspace.name}</div>
      <div className={styles.workspaceItemDescription}>
        {workspace.description}
      </div>
    </button>
  );
};

export default WorkspaceDropdownItem;
