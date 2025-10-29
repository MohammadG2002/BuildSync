import styles from "./GlobalSearch.module.css";

const SearchFooter = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerHints}>
        <span className={styles.footerHint}>
          <kbd className={styles.footerKbd}>↑↓</kbd>
          Navigate
        </span>
        <span className={styles.footerHint}>
          <kbd className={styles.footerKbd}>↵</kbd>
          Select
        </span>
        <span className={styles.footerHint}>
          <kbd className={styles.footerKbd}>ESC</kbd>
          Close
        </span>
      </div>
    </div>
  );
};

export default SearchFooter;
