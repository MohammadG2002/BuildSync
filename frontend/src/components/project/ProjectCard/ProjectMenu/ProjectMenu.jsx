import { MoreVertical, Edit, Trash2 } from "lucide-react";
import styles from "./ProjectMenu.module.css";

const ProjectMenu = ({ showMenu, onToggle, onEdit, onDelete, project }) => {
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
              onEdit(project);
            }}
            className={styles.menuItem}
          >
            <Edit className={styles.menuItemIcon} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project);
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

export default ProjectMenu;
