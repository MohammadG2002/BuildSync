import React from "react";
import { Paperclip, Send } from "lucide-react";
import styles from "../../TaskDetailsModal.module.css";

const CommentInputBar = ({
  newComment,
  onChange,
  onUnifiedSend,
  fileInputRef,
  onFileSelect,
  onClearQueued,
  queuedFilesLength,
  readOnly,
  isSubmitting,
  isUploading,
  isSendingQueued,
}) => {
  return (
    <form className={styles.commentForm} onSubmit={onUnifiedSend}>
      <div className={styles.commentInputWrapper}>
        <input
          type="text"
          placeholder="Write a comment..."
          className={styles.commentInput}
          value={newComment}
          onChange={(e) => onChange(e.target.value)}
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
          onClick={onUnifiedSend}
          disabled={
            readOnly ||
            isSubmitting ||
            isSendingQueued ||
            (queuedFilesLength === 0 && (newComment || "").trim().length === 0)
          }
          title={
            isSendingQueued
              ? "Sending..."
              : queuedFilesLength > 0
              ? "Send selected attachments"
              : (newComment || "").trim().length > 0
              ? "Send comment"
              : "Type a comment or add files"
          }
          aria-label={
            isSendingQueued
              ? "Sending"
              : queuedFilesLength > 0
              ? "Send attachments"
              : (newComment || "").trim().length > 0
              ? "Send comment"
              : "Send disabled"
          }
        >
          <Send className={styles.commentSubmitIcon} />
        </button>
        {queuedFilesLength > 0 && (
          <button
            type="button"
            className={styles.commentAttachButton}
            onClick={onClearQueued}
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
        onChange={onFileSelect}
        className={styles.fileInput}
        disabled={isUploading || isSendingQueued || readOnly}
      />
      {queuedFilesLength > 0 && (
        <div className={styles.metadataTextMuted} style={{ marginTop: 8 }}>
          {queuedFilesLength} file(s) selected
        </div>
      )}
    </form>
  );
};

export default CommentInputBar;
