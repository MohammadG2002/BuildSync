import getResultIcon from "./getResultIcon";
import styles from "./GlobalSearch.module.css";

const SearchResultItem = ({ result, onClick }) => {
  const Icon = getResultIcon(result.type);

  return (
    <button onClick={onClick} className={styles.resultItem}>
      <div className={styles.resultIcon}>
        <Icon className={styles.resultIconSvg} />
      </div>
      <div className={styles.resultContent}>
        <p className={styles.resultTitle}>{result.name || result.title}</p>
        <p className={styles.resultSubtitle}>
          {result.workspace || result.project || result.role || result.type}
        </p>
      </div>
      <span className={styles.resultType}>{result.type}</span>
    </button>
  );
};

export default SearchResultItem;
