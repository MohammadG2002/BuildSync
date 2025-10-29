import styles from "./ActivityFeed.module.css";

const ActivityFilters = ({ filter, onFilterChange }) => {
  const filterOptions = [
    { value: "all", label: "All Activity" },
    { value: "tasks", label: "Tasks" },
    { value: "projects", label: "Projects" },
    { value: "members", label: "Members" },
    { value: "files", label: "Files" },
  ];

  return (
    <div className={styles.filters}>
      {filterOptions.map((filterOption) => {
        const isActive = filter === filterOption.value;
        const buttonClass = isActive
          ? `${styles.filterButton} ${styles.filterButtonActive}`
          : `${styles.filterButton} ${styles.filterButtonInactive}`;

        return (
          <button
            key={filterOption.value}
            onClick={() => onFilterChange(filterOption.value)}
            className={buttonClass}
          >
            {filterOption.label}
          </button>
        );
      })}
    </div>
  );
};

export default ActivityFilters;
