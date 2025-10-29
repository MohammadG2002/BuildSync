import styles from "./ProjectForm.module.css";

const DescriptionField = ({ value, onChange }) => {
  return (
    <div>
      <label className={styles.label}>Description (Optional)</label>
      <textarea
        name="description"
        rows="3"
        placeholder="What is this project about?"
        value={value}
        onChange={onChange}
        className={styles.textarea}
      />
    </div>
  );
};

export default DescriptionField;
