import React from "react";
import { Paperclip, Download, Trash2 } from "lucide-react";
import styles from "../../TaskDetailsModal.module.css";
import { buildAbsoluteUrl } from "../../../../../utils/helpers/buildAbsoluteUrl";
import formatFileSize from "../../../../../utils/helpers/formatFileSize";
import { downloadFromApi } from "../../../../../utils/helpers/downloadFromApi";

const AttachmentRow = ({ attachment, taskId, onDeleteAttachment }) => {
  const name = attachment.originalName || attachment.filename;
  return (
    <div>
      <div className={styles.attachmentItem}>
        <a
          href={attachment.url ? buildAbsoluteUrl(attachment.url) : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.attachmentContent}
          title={name || "View file"}
        >
          <Paperclip className={styles.attachmentIcon} />
          <div className={styles.attachmentInfo}>
            <p className={styles.attachmentName}>{name}</p>
            <p className={styles.attachmentMeta}>
              {attachment.size && formatFileSize(attachment.size)}
            </p>
          </div>
        </a>
        <div className={styles.attachmentActions}>
          {attachment._id && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const baseQ = attachment.url
                    ? `?url=${encodeURIComponent(
                        attachment.url
                      )}&name=${encodeURIComponent(name || "")}`
                    : "?";
                  const q = `${baseQ}${
                    baseQ.includes("?") && baseQ.length > 1 ? "&" : ""
                  }section=test`;
                  await downloadFromApi(
                    `/tasks/${taskId}/attachments/${attachment._id}/download${q}`,
                    name
                  );
                } catch (err) {
                  console.error("Download failed:", err);
                  if (attachment.url) {
                    const href = buildAbsoluteUrl(attachment.url);
                    const a = document.createElement("a");
                    a.href = href;
                    a.target = "_blank";
                    a.rel = "noopener noreferrer";
                    a.download = name || undefined;
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
            onClick={() => onDeleteAttachment?.(taskId, attachment._id, "test")}
            className={styles.deleteButton}
          >
            <Trash2 className={styles.actionIcon} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentRow;
