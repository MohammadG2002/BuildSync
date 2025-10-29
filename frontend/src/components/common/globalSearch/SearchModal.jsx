import SearchInput from "./SearchInput";
import SearchCategories from "./SearchCategories";
import SearchResults from "./SearchResults";
import SearchFooter from "./SearchFooter";
import styles from "./GlobalSearch.module.css";

const SearchModal = ({
  searchRef,
  inputRef,
  searchQuery,
  onSearchChange,
  onClose,
  categories,
  activeCategory,
  onCategoryChange,
  results,
  filteredResults,
  onResultClick,
}) => {
  return (
    <div className={styles.overlay} data-onboarding="global-search">
      <div ref={searchRef} className={styles.modal}>
        <SearchInput
          inputRef={inputRef}
          searchQuery={searchQuery}
          onChange={onSearchChange}
          onClose={onClose}
        />

        {searchQuery && (
          <SearchCategories
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            results={results}
          />
        )}

        <div className={styles.resultsContainer}>
          <SearchResults
            searchQuery={searchQuery}
            results={filteredResults}
            onResultClick={onResultClick}
          />
        </div>

        <SearchFooter />
      </div>
    </div>
  );
};

export default SearchModal;
