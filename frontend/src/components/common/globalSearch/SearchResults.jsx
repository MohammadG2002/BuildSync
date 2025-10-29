import SearchResultItem from "./SearchResultItem";
import SearchEmptyState from "./SearchEmptyState";
import SearchNoResults from "./SearchNoResults";
import styles from "./GlobalSearch.module.css";

const SearchResults = ({ searchQuery, results, onResultClick }) => {
  if (!searchQuery) {
    return <SearchEmptyState />;
  }

  if (results.length === 0) {
    return <SearchNoResults />;
  }

  return (
    <div className={styles.results}>
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.type}-${result.id || index}`}
          result={result}
          onClick={() => onResultClick(result, result.type)}
        />
      ))}
    </div>
  );
};

export default SearchResults;
