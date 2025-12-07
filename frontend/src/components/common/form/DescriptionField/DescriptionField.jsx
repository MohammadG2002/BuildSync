import styles from "./DescriptionField.module.css";

const DescriptionField = ({
  value,
  onChange,
  rows = 4,
  placeholder = "Add more details...",
  label = "Description (Optional)",
}) => {
  return (
    <div>
      <label className={styles.descriptionLabel}>{label}</label>
      <textarea
        name="description"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.descriptionTextarea}
      />
    </div>
  );
};

export default DescriptionField;
