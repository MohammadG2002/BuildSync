import { Edit2, Save } from "lucide-react";
import styles from "./DescriptionSection.module.css";

const DescriptionSection = ({
  description,
  isEditing,
  editedDescription,
  onEdit,
  onSave,
  onCancel,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Description</h3>
        {!isEditing && !readOnly && (
          <button onClick={onEdit} className={styles.editButton}>
            <Edit2 className={styles.editIcon} />
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={editedDescription}
            onChange={onChange}
            className={styles.descriptionTextarea}
            placeholder="Add a description..."
          />
          <div className={styles.descriptionActions}>
            <button onClick={onSave} className={styles.saveButton}>
              <Save className={styles.actionIcon} />
              Save
            </button>
            <button onClick={onCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.description}>
          {description || "No description provided."}
        </p>
      )}
    </div>
  );
};

export default DescriptionSection;
