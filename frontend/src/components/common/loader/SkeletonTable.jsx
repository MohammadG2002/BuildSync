import styles from "./Loader.module.css";

const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className={styles.skeletonCard}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className={styles.skeletonTableRow}>
        <div className={styles.skeletonTableCell}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: "1rem",
            }}
          >
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className={styles.skeletonLine}></div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonTable;
