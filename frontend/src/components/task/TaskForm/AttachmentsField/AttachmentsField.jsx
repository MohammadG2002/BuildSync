import { Paperclip } from "lucide-react";
import FileUpload from "../../../common/fileUpload/FileUpload/FileUpload";
import styles from "./AttachmentsField.module.css";

const AttachmentsField = ({ showFileUpload, onToggle, onFilesSelected }) => {
  return (
    <div>
      <div className={styles.attachmentsHeader}>
        <label className={styles.attachmentsLabel}>
          Attachments (Optional)
        </label>
        <button
          type="button"
          onClick={onToggle}
          className={styles.attachmentsButton}
        >
          <Paperclip className={styles.attachmentsIcon} />
          {showFileUpload ? "Hide" : "Add Attachments"}
        </button>
      </div>

      {showFileUpload && (
        <FileUpload
          onFilesSelected={onFilesSelected}
          maxFiles={5}
          maxSize={10}
        />
      )}
    </div>
  );
};

export default AttachmentsField;
