import { Search } from "lucide-react";
import styles from "./GlobalSearch.module.css";

const SearchTriggerButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.triggerButton}>
      <Search className={styles.triggerIcon} />
      <span className={styles.triggerText}>Search...</span>
      <kbd className={styles.triggerKbd}>⌘K</kbd>
    </button>
  );
};

export default SearchTriggerButton;
