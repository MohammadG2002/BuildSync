import { Search } from "lucide-react";
import styles from "./SearchEmptyState.module.css";

const SearchEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <Search className={styles.emptyIcon} />
      <p className={styles.emptyTitle}>Search anything</p>
      <p className={styles.emptySubtitle}>
        Find workspaces, projects, tasks, or team members
      </p>
    </div>
  );
};

export default SearchEmptyState;
