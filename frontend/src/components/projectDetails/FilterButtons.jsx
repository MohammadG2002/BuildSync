import { Filter } from "lucide-react";
import styles from "../../pages/projects/ProjectDetails.module.css";

const FilterButtons = ({ filterStatus, onFilterChange }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "In Review" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className={styles.filterButtons}>
      <div className={styles.filterLabel}>
        <Filter className={`w-5 h-5 ${styles.filterIcon}`} />
        <span className={styles.filterLabelText}>Status:</span>
      </div>
      <div className={styles.filterButtonsGroup}>
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`${styles.filterButton} ${
              filterStatus === filter.value
                ? styles.filterButtonActive
                : styles.filterButtonInactive
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterButtons;
