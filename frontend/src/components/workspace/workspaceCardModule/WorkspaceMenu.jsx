import { MoreVertical, Edit, Trash2 } from "lucide-react";
import styles from "./WorkspaceCard.module.css";

const WorkspaceMenu = ({ showMenu, onToggle, onEdit, onDelete, workspace }) => {
  return (
    <div className={styles.menu}>
      <button
        className={`menu-button ${styles.menuButton}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        <MoreVertical className={styles.menuIcon} />
      </button>

      {showMenu && (
        <div className={`menu-dropdown ${styles.menuDropdown}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(workspace);
            }}
            className={styles.menuItem}
          >
            <Edit className={styles.menuItemIcon} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(workspace);
            }}
            className={`${styles.menuItem} ${styles.menuItemDelete}`}
          >
            <Trash2 className={styles.menuItemIcon} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkspaceMenu;
