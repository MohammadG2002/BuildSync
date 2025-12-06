import SearchInput from "../SearchInput/SearchInput";
import SearchCategories from "../SearchCategories/SearchCategories";
import SearchResults from "../SearchResults/SearchResults";
import SearchFooter from "../SearchFooter/SearchFooter";
import styles from "./SearchModal.module.css";

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
