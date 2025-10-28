import SearchInput from "./SearchInput";
import SearchCategories from "./SearchCategories";
import SearchResults from "./SearchResults";
import SearchFooter from "./SearchFooter";

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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black bg-opacity-50 animate-fade-in"
      data-onboarding="global-search"
    >
      <div
        ref={searchRef}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl animate-scale-in"
      >
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

        <div className="max-h-96 overflow-y-auto">
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
