import { Paperclip, Download, Trash2 } from "lucide-react";
import { formatDate } from "../../../../utils/helpers";
import formatFileSize from "../../../../utils/helpers/formatFileSize";
import { buildAbsoluteUrl } from "../../../../utils/helpers/buildAbsoluteUrl";
import { downloadFromApi } from "../../../../utils/helpers/downloadFromApi";
import styles from "./AttachmentsSection.module.css";

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
          {attachments.map((attachment, index) => {
            const name =
              attachment?.originalName || attachment?.filename || "Attachment";
            const href = attachment?.url
              ? buildAbsoluteUrl(attachment.url)
              : undefined;
            const filenameOrUrl =
              attachment?.originalName ||
              attachment?.filename ||
              attachment?.url ||
              "";
            const isImage =
              !!href &&
              (attachment?.mimetype?.startsWith?.("image/") ||
                /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(filenameOrUrl));

            return (
              <div key={index} className={styles.attachmentItem}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attachmentContent}
                  title={name}
                >
                  {isImage ? (
                    <img
                      src={href}
                      alt={name}
                      style={{
                        maxWidth: "120px",
                        maxHeight: "120px",
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <Paperclip className={styles.attachmentIcon} />
                  )}
                  <div className={styles.attachmentInfo}>
                    <p className={styles.attachmentMeta}>
                      {attachment?.size && formatFileSize(attachment.size)} •{" "}
                      {attachment?.uploadedAt &&
                        formatDate(attachment.uploadedAt)}
                    </p>
                  </div>
                </a>
                <div className={styles.attachmentActions}>
                  {attachment._id && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const name =
                            attachment.originalName || attachment.filename;
                          const q = attachment.url
                            ? `?url=${encodeURIComponent(
                                attachment.url
                              )}&name=${encodeURIComponent(name || "")}`
                            : "";
                          await downloadFromApi(
                            `/tasks/${taskId}/attachments/${attachment._id}/download${q}`,
                            name
                          );
                        } catch (err) {
                          console.error("Download failed:", err);
                          // Fallback to direct URL open if API download is unavailable
                          if (attachment.url) {
                            const href = buildAbsoluteUrl(attachment.url);
                            const a = document.createElement("a");
                            a.href = href;
                            a.target = "_blank";
                            a.rel = "noopener noreferrer";
                            a.download =
                              attachment.originalName ||
                              attachment.filename ||
                              undefined;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                          }
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
            );
          })}
        </div>
      ) : (
        <p className={styles.metadataTextMuted}>No attachments</p>
      )}
    </div>
  );
};

export default AttachmentsSection;
