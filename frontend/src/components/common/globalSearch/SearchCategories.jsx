import getResultIcon from "../../../utils/common/globalSearch/getResultIcon";
import styles from "./GlobalSearch.module.css";

const SearchCategories = ({
  categories,
  activeCategory,
  onCategoryChange,
  results,
}) => {
  return (
    <div className={styles.categories}>
      {categories.map((category) => {
        const Icon = getResultIcon(category.id);
        const count =
          category.id === "all" ? 0 : results[category.id]?.length || 0;
        const isActive = activeCategory === category.id;
        const buttonClass = [
          styles.categoryButton,
          isActive && styles.categoryButtonActive,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={buttonClass}
          >
            {Icon && <Icon className={styles.categoryIcon} />}
            <span>{category.label}</span>
            {count > 0 && <span className={styles.categoryCount}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default SearchCategories;
