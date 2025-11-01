import { Paperclip, Download, Trash2 } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import formatFileSize from "../../../utils/helpers/formatFileSize";
import { buildAbsoluteUrl } from "../../../utils/buildAbsoluteUrl";
import { API_CONFIG } from "../../../config/api.config";
import { downloadFromApi } from "../../../utils/downloadFromApi";
import styles from "./TaskDetailsModal.module.css";

const AttachmentsSection = ({
  attachments,
  onAddFile,
  onDeleteAttachment,
  taskId,
  fileInputRef,
  isUploading,
  readOnly = false,
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
          disabled={isUploading || readOnly}
        >
          {isUploading ? "Uploading..." : "Add File"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onAddFile}
          className={styles.fileInput}
          disabled={isUploading || readOnly}
        />
      </div>
      {attachments && attachments.length > 0 ? (
        <div className={styles.attachmentsList}>
          {attachments.map((attachment, index) => (
            <div key={index} className={styles.attachmentItem}>
              <a
                href={
                  attachment.url ? buildAbsoluteUrl(attachment.url) : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className={styles.attachmentContent}
                title={
                  attachment.originalName ||
                  attachment.filename ||
                  "View attachment"
                }
              >
                <Paperclip className={styles.attachmentIcon} />
                <div className={styles.attachmentInfo}>
                  <p className={styles.attachmentName}>
                    {attachment.originalName || attachment.filename}
                  </p>
                  <p className={styles.attachmentMeta}>
                    {attachment.size && formatFileSize(attachment.size)} • {""}
                    {attachment.uploadedAt && formatDate(attachment.uploadedAt)}
                  </p>
                </div>
              </a>
              <div className={styles.attachmentActions}>
                {attachment._id && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await downloadFromApi(
                          `/tasks/${taskId}/attachments/${attachment._id}/download`,
                          attachment.originalName || attachment.filename
                        );
                      } catch (err) {
                        console.error("Download failed:", err);
                      }
                    }}
                    className={styles.downloadButton}
                    title="Download"
                  >
                    <Download className={styles.actionIcon} />
                  </button>
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
