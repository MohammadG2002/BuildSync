import styles from "./TaskCheckbox.module.css";

const TaskCheckbox = ({ checked, onChange, disabled = false }) => {
  return (
    <div className={`checkbox-wrapper ${styles.checkboxWrapper}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={styles.checkbox}
      />
    </div>
  );
};

export default TaskCheckbox;
