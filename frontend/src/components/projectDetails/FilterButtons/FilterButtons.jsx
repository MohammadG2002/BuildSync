import { Filter } from "lucide-react";
import { TASK_STATUS } from "../../../utils/constants";
import styles from "./FilterButtons.module.css";

const FilterButtons = ({ filterStatus, onFilterChange }) => {
  const filters = [
    { value: "all", label: "All" },
    { value: TASK_STATUS.TODO, label: "To Do" },
    { value: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
    { value: TASK_STATUS.REVIEW, label: "In Review" },
    { value: TASK_STATUS.COMPLETED, label: "Done" },
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
