import styles from "./WorkspaceForm.module.css";

const WorkspaceDescriptionField = ({ value, onChange }) => {
  return (
    <div className={styles.descriptionContainer}>
      <label className={styles.label}>Description (Optional)</label>
      <textarea
        name="description"
        rows="3"
        placeholder="What is this workspace for?"
        value={value}
        onChange={onChange}
        className={styles.textarea}
      />
    </div>
  );
};

export default WorkspaceDescriptionField;
