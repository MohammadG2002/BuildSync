import { Search, X } from "lucide-react";
import styles from "./GlobalSearch.module.css";

const SearchInput = ({ inputRef, searchQuery, onChange, onClose }) => {
  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <Search className={styles.searchIcon} />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={onChange}
          placeholder="Search workspaces, projects, tasks, members..."
          className={styles.input}
        />
        <button onClick={onClose} className={styles.closeButton}>
          <X className={styles.closeIcon} />
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
