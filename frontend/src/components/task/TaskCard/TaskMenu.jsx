import { MoreVertical, Edit, Trash2, Archive } from "lucide-react";
import styles from "./TaskCard.module.css";

const TaskMenu = ({
  showMenu,
  onToggle,
  onEdit,
  onDelete,
  onArchive,
  task,
}) => {
  return (
    <div className={styles.menuContainer}>
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
              onEdit(task);
            }}
            className={styles.menuItem}
          >
            <Edit className={styles.menuItemIcon} />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive(task);
            }}
            className={styles.menuItem}
          >
            <Archive className={styles.menuItemIcon} />
            <span>Archive</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
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

export default TaskMenu;
