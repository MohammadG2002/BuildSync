import styles from "./GroupBySelector.module.css";

const GroupBySelector = ({ value, onChange }) => {
  return (
    <div className={styles.groupBySelector}>
      <span className={styles.groupByLabel}>Group by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.groupBySelect}
      >
        <option value="none">None</option>
        <option value="status">Status</option>
        <option value="priority">Priority</option>
      </select>
    </div>
  );
};

export default GroupBySelector;
