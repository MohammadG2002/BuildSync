import styles from "./TaskCard.module.css";

const TaskCheckbox = ({ checked, onChange }) => {
  return (
    <div className={`checkbox-wrapper ${styles.checkboxWrapper}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkbox}
      />
    </div>
  );
};

export default TaskCheckbox;
