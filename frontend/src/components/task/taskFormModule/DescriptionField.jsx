import styles from "./TaskForm.module.css";

const DescriptionField = ({ value, onChange }) => {
  return (
    <div>
      <label className={styles.descriptionLabel}>Description (Optional)</label>
      <textarea
        name="description"
        rows="4"
        placeholder="Add more details about this task..."
        value={value}
        onChange={onChange}
        className={styles.descriptionTextarea}
      />
    </div>
  );
};

export default DescriptionField;
