import React from "react";
import { Paperclip, Download, Trash2, Send, MessageSquare } from "lucide-react";
import { formatDate, getRelativeTime } from "../../../../utils/helpers";
import formatFileSize from "../../../../utils/helpers/formatFileSize";
import { buildAbsoluteUrl } from "../../../../utils/helpers/buildAbsoluteUrl";
import { downloadFromApi } from "../../../../utils/helpers/downloadFromApi";
import styles from "./FilesSection.module.css";

/**
 * FilesSection
 * A dedicated tab for importing and managing task files.
 * Uses the exact same import method as the Overview attachments section,
 * but also displays who imported each file.
 */

// Note: attachments are rendered as standalone items; no FileCard wrapper is used.
const FilesSection = ({
  attachments,
  comments = [],
  onAddFile,
  onDeleteAttachment,
  onAddComment,
  taskId,
  fileInputRef,
  isUploading,
  readOnly = false,
}) => {
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleSubmitComment = async (e) => {
    e?.preventDefault?.();
    if (readOnly) return;
    const text = (newComment || "").trim();
    if (!text) return;
    try {
      setIsSubmitting(true);
      await onAddComment?.(taskId, text, []);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment from Files tab:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build a single combined feed of comments and attachments as separate items
  const combinedItems = React.useMemo(() => {
    const att = Array.isArray(attachments)
      ? attachments.map((a) => ({
          type: "attachment",
          data: a,
          date: a?.uploadedAt || a?.createdAt || null,
          key: a?._id || a?.url || JSON.stringify(a),
        }))
      : [];
    const com = Array.isArray(comments)
      ? comments.map((c) => ({
          type: "comment",
          data: c,
          date: c?.createdAt || null,
          key: c?._id || JSON.stringify(c),
        }))
      : [];
    return [...att, ...com].sort((x, y) => {
      const dx = x.date ? new Date(x.date).getTime() : 0;
      const dy = y.date ? new Date(y.date).getTime() : 0;
      return dy - dx; // newest first
    });
  }, [attachments, comments]);

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div className={styles.metadataItemHeader}>
          <Paperclip className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>
            Files {attachments?.length > 0 && `(${attachments.length})`}
          </h3>
        </div>
      </div>

      {/* Comment input bar with attachment icon */}
      <form className={styles.commentForm} onSubmit={handleSubmitComment}>
        <div className={styles.commentInputWrapper}>
          <input
            type="text"
            placeholder="Write a comment..."
            className={styles.commentInput}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={readOnly || isSubmitting}
          />
          <button
            type="button"
            className={styles.commentAttachButton}
            title="Import files"
            onClick={() => fileInputRef.current?.click()}
            disabled={readOnly || isUploading}
          >
            <Paperclip className={styles.commentSubmitIcon} />
          </button>
          <button
            type="submit"
            className={styles.commentSubmit}
            disabled={
              readOnly || isSubmitting || newComment.trim().length === 0
            }
            title="Send comment"
          >
            <Send className={styles.commentSubmitIcon} />
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
        {/* Hidden file input used by the attach button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onAddFile}
          className={styles.fileInput}
          disabled={isUploading || readOnly}
        />
      </form>

      {/* Combined feed of comments and attachments */}
      {combinedItems.length > 0 ? (
        <div className={styles.attachmentsList}>
          {combinedItems.map((item, idx) => {
            if (item.type === "comment") {
              const comment = item.data;
              const authorName =
                comment.user?.name || comment.user?.email || "Unknown User";
              const createdAt = comment.createdAt;
              const hasText = (comment.content || "").trim().length > 0;
              const nameLine = hasText ? comment.content : "Comment";
              const attachmentsCount = Array.isArray(comment.attachments)
                ? comment.attachments.length
                : 0;
              return (
                <div key={item.key || idx}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{authorName}</span>
                    <span className={styles.commentDate}>
                      {createdAt ? ` - ${getRelativeTime(createdAt)}` : ""}
                    </span>
                  </div>
                  <div className={styles.attachmentItem}>
                    <div
                      className={styles.attachmentContent}
                      title={hasText ? comment.content : "Comment"}
                    >
                      <MessageSquare className={styles.attachmentIcon} />
                      <div className={styles.attachmentInfo}>
                        <p className={styles.attachmentName}>{nameLine}</p>
                        <p className={styles.attachmentMeta}>
                          {createdAt && formatDate(createdAt)}
                          {attachmentsCount > 0 &&
                            ` • ${attachmentsCount} attachment${
                              attachmentsCount > 1 ? "s" : ""
                            }`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // attachment item
            const attachment = item.data;
            const name = attachment.originalName || attachment.filename;
            const uploaderName =
              attachment.uploadedBy?.name ||
              attachment.uploadedBy?.email ||
              "Unknown";
            const uploadedAt = attachment.uploadedAt;
            return (
              <div key={item.key || idx}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{uploaderName}</span>
                  <span className={styles.commentDate}>
                    {uploadedAt ? ` - ${getRelativeTime(uploadedAt)}` : ""}
                  </span>
                </div>
                <div className={styles.attachmentItem}>
                  <a
                    href={
                      attachment.url
                        ? buildAbsoluteUrl(attachment.url)
                        : undefined
                    }
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
                        {attachment.uploadedAt &&
                          ` • ${formatDate(attachment.uploadedAt)}`}
                      </p>
                    </div>
                  </a>
                  <div className={styles.attachmentActions}>
                    {attachment._id && (
                      <button
                        type="button"
                        onClick={async () => {
                          try {
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
                      onClick={() =>
                        onDeleteAttachment?.(taskId, attachment._id)
                      }
                      className={styles.deleteButton}
                    >
                      <Trash2 className={styles.actionIcon} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.metadataTextMuted}>No files or comments</p>
      )}
    </div>
  );
};

export default FilesSection;
