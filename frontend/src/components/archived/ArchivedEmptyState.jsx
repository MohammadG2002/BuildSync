import { Archive } from "lucide-react";
import Card from "../common/Card";
import styles from "../../pages/archived/Archived.module.css";

const ArchivedEmptyState = ({ searchQuery, filterProject }) => {
  const hasFilters = searchQuery || filterProject !== "all";

  return (
    <Card className={styles.emptyState}>
      <Archive className={styles.emptyIcon} />
      <h3 className={styles.emptyTitle}>
        {hasFilters ? "No archived tasks found" : "No archived tasks yet"}
      </h3>
      <p className={styles.emptyDescription}>
        {hasFilters
          ? "Try adjusting your filters"
          : "Archived tasks will appear here"}
      </p>
    </Card>
  );
};

export default ArchivedEmptyState;
