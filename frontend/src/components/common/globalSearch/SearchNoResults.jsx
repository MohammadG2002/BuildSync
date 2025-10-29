import styles from "./GlobalSearch.module.css";

const SearchNoResults = () => {
  return (
    <div className={styles.noResults}>
      <p className={styles.noResultsTitle}>No results found</p>
      <p className={styles.noResultsSubtitle}>
        Try searching with different keywords
      </p>
    </div>
  );
};

export default SearchNoResults;
