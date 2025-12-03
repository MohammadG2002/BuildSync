import { Search } from "lucide-react";
import Input from "../../common/input/Input";
import styles from "./ArchivedFilters.module.css";

const ArchivedFilters = ({
  searchQuery,
  onSearchChange,
  filterProject,
  onFilterChange,
  projects,
}) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchWrapper}>
        <Input
          type="text"
          placeholder="Search archived tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>
      <div className={styles.filterGroup}>
        <span className={styles.filterLabel}>Project:</span>
        <select
          value={filterProject}
          onChange={(e) => onFilterChange(e.target.value)}
          className={styles.select}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ArchivedFilters;
