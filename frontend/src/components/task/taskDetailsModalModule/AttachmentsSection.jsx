import { Paperclip, Download, Trash2 } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import { formatFileSize } from "./formatFileSize";
import styles from "./TaskDetailsModal.module.css";

const AttachmentsSection = ({
  attachments,
  onAddFile,
  onDeleteAttachment,
  taskId,
  fileInputRef,
}) => {
  return (
    <div>
      <div className={styles.sectionHeader}>
        <div className={styles.metadataItemHeader}>
          <Paperclip className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>
            Attachments {attachments?.length > 0 && `(${attachments.length})`}
          </h3>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={styles.addFileButton}
        >
          Add File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onAddFile}
          className={styles.fileInput}
        />
      </div>
      {attachments && attachments.length > 0 ? (
        <div className={styles.attachmentsList}>
          {attachments.map((attachment, index) => (
            <div key={index} className={styles.attachmentItem}>
              <div className={styles.attachmentContent}>
                <Paperclip className={styles.attachmentIcon} />
                <div className={styles.attachmentInfo}>
                  <p className={styles.attachmentName}>
                    {attachment.originalName || attachment.filename}
                  </p>
                  <p className={styles.attachmentMeta}>
                    {attachment.size && formatFileSize(attachment.size)} •{" "}
                    {attachment.uploadedAt && formatDate(attachment.uploadedAt)}
                  </p>
                </div>
              </div>
              <div className={styles.attachmentActions}>
                {attachment.url && (
                  <a
                    href={attachment.url}
                    download
                    className={styles.downloadButton}
                  >
                    <Download className={styles.actionIcon} />
                  </a>
                )}
                <button
                  onClick={() => onDeleteAttachment?.(taskId, attachment._id)}
                  className={styles.deleteButton}
                >
                  <Trash2 className={styles.actionIcon} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.metadataTextMuted}>No attachments</p>
      )}
    </div>
  );
};

export default AttachmentsSection;
