import React from "react";
import { Paperclip, Download, Trash2, Send, MessageSquare } from "lucide-react";
import { getRelativeTime } from "../../../utils/helpers";
import formatFileSize from "../../../utils/helpers/formatFileSize";
import { buildAbsoluteUrl } from "../../../utils/buildAbsoluteUrl";
import { downloadFromApi } from "../../../utils/downloadFromApi";
import styles from "./TaskDetailsModal.module.css";

// CommentsSection (Test-like behavior): queued attachments + auto-send comment + combined feed
const CommentsSection = ({
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
  // Queue selected files instead of uploading immediately
  const [queuedFiles, setQueuedFiles] = React.useState([]);
  const [isSendingQueued, setIsSendingQueued] = React.useState(false);

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
      console.error("Failed to add comment from Comments tab:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Queue files on selection (do not upload immediately)
  const handleFileSelect = (e) => {
    if (readOnly) return;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setQueuedFiles((prev) => [...prev, ...files]);
    try {
      if (e.target) e.target.value = "";
    } catch (_) {}
  };

  const handleSendQueuedFiles = async () => {
    if (readOnly || queuedFiles.length === 0) return;
    if (typeof onAddFile !== "function") return;
    setIsSendingQueued(true);
    try {
      // Build a synthetic event with a FileList so we can reuse onAddFile
      const dt = new DataTransfer();
      queuedFiles.forEach((f) => dt.items.add(f));
      const syntheticEvent = { target: { files: dt.files } };
      await onAddFile(syntheticEvent);
      setQueuedFiles([]);
      // After attachments upload, automatically send the comment.
      // Requirement: at least send an empty comment
      try {
        setIsSubmitting(true);
        const text = (newComment || "").trim();
        await onAddComment?.(taskId, text, []);
        setNewComment("");
      } catch (e) {
        console.error("Auto-send comment after attachments failed:", e);
      } finally {
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to send queued files (Comments tab):", err);
    } finally {
      setIsSendingQueued(false);
    }
  };

  const handleClearQueued = () => setQueuedFiles([]);

  // Unified send: if files queued, send files (and auto-comment); otherwise send comment text
  const handleUnifiedSend = async (e) => {
    e?.preventDefault?.();
    if (readOnly) return;
    if (queuedFiles.length > 0) {
      await handleSendQueuedFiles();
      return;
    }
    await handleSubmitComment();
  };

  // Combined feed of attachments and comments (separate items)
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
      return dy - dx;
    });
  }, [attachments, comments]);

  return (
    <div>
      <div className={styles.sectionHeader}>
        <div className={styles.metadataItemHeader}>
          <Paperclip className={styles.metadataIcon} />
          <h3 className={styles.metadataItemTitle}>
            Comments {attachments?.length > 0 && `(${attachments.length})`}
          </h3>
        </div>
      </div>

      {/* Comment input bar with single unified Send button */}
      <form className={styles.commentForm} onSubmit={handleUnifiedSend}>
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
            disabled={readOnly || isUploading || isSendingQueued}
          >
            <Paperclip className={styles.commentSubmitIcon} />
          </button>
          <button
            type="submit"
            className={styles.commentSubmit}
            onClick={handleUnifiedSend}
            disabled={
              readOnly ||
              isSubmitting ||
              isSendingQueued ||
              (queuedFiles.length === 0 && newComment.trim().length === 0)
            }
            title={
              isSendingQueued
                ? "Sending..."
                : queuedFiles.length > 0
                ? "Send selected attachments"
                : newComment.trim().length > 0
                ? "Send comment"
                : "Type a comment or add files"
            }
            aria-label={
              isSendingQueued
                ? "Sending"
                : queuedFiles.length > 0
                ? "Send attachments"
                : newComment.trim().length > 0
                ? "Send comment"
                : "Send disabled"
            }
          >
            <Send className={styles.commentSubmitIcon} />
          </button>
          {queuedFiles.length > 0 && (
            <button
              type="button"
              className={styles.commentAttachButton}
              onClick={handleClearQueued}
              disabled={readOnly || isSendingQueued}
              title="Clear selected attachments"
            >
              Clear
            </button>
          )}
        </div>
        {/* Hidden file input used by the attach button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className={styles.fileInput}
          disabled={isUploading || isSendingQueued || readOnly}
        />
        {queuedFiles.length > 0 && (
          <div className={styles.metadataTextMuted} style={{ marginTop: 8 }}>
            {queuedFiles.length} file(s) selected
          </div>
        )}
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
              const nameLine = hasText ? comment.content : "";
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
                      title={hasText ? comment.content : undefined}
                    >
                      <MessageSquare className={styles.attachmentIcon} />
                      <div className={styles.attachmentInfo}>
                        <p className={styles.attachmentName}>{nameLine}</p>
                        <p className={styles.attachmentMeta}>
                          {attachmentsCount > 0 &&
                            `${attachmentsCount} attachment${
                              attachmentsCount > 1 ? "s" : ""
                            }`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            const attachment = item.data;
            const name = attachment.originalName || attachment.filename;
            return (
              <div key={item.key || idx}>
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
                      onClick={() =>
                        onDeleteAttachment?.(taskId, attachment._id, "test")
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

export default CommentsSection;
