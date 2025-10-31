import { MessageSquare, Send, Paperclip, Download, Upload } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import formatFileSize from "../../../utils/helpers/formatFileSize";
import styles from "./TaskDetailsModal.module.css";

const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  onSubmit,
  isSubmitting,
  selectedFiles,
  onFileSelect,
  onRemoveFile,
  fileInputRef,
}) => {
  return (
    <div>
      <div className={styles.metadataItemHeader}>
        <MessageSquare className={styles.metadataIcon} />
        <h3 className={styles.metadataItemTitle}>
          Comments {comments?.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment List */}
      {comments && comments.length > 0 && (
        <div className={styles.commentsList}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <div
                className={styles.commentAvatar}
                style={{
                  backgroundColor: generateColor(comment.user?.name || "User"),
                }}
              >
                {getInitials(comment.user?.name || "U")}
              </div>
              <div className={styles.commentContent}>
                <div className={styles.commentBubble}>
                  <div className={styles.commentHeader}>
                    <p className={styles.commentAuthor}>
                      {comment.user?.name || "Unknown User"}
                    </p>
                    <span className={styles.commentDate}>
                      {comment.createdAt && formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className={styles.commentText}>{comment.content}</p>

                  {/* Comment Attachments */}
                  {comment.attachments && comment.attachments.length > 0 && (
                    <div className={styles.commentAttachments}>
                      {comment.attachments.map((attachment, attIndex) => (
                        <div
                          key={attIndex}
                          className={styles.commentAttachmentItem}
                        >
                          <Paperclip className={styles.commentAttachmentIcon} />
                          <span className={styles.commentAttachmentName}>
                            {attachment.name}
                          </span>
                          {attachment.size && (
                            <span className={styles.commentAttachmentSize}>
                              ({formatFileSize(attachment.size)})
                            </span>
                          )}
                          {attachment.url && (
                            <a
                              href={attachment.url}
                              download
                              className={styles.commentAttachmentDownload}
                            >
                              <Download size={14} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={onSubmit} className={styles.commentForm}>
        <div className={styles.commentInputWrapper}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className={styles.commentInput}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => fileInputRef?.current?.click()}
            className={styles.commentAttachButton}
            disabled={isSubmitting}
            title="Attach file"
          >
            <Paperclip size={18} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onFileSelect}
            className={styles.fileInput}
            disabled={isSubmitting}
          />
        </div>

        {/* Selected Files Preview */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div className={styles.selectedFilesList}>
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className={styles.selectedFileItem}>
                <Paperclip size={14} />
                <span className={styles.selectedFileName}>{file.name}</span>
                <span className={styles.selectedFileSize}>
                  ({formatFileSize(file.size)})
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveFile?.(index)}
                  className={styles.removeFileButton}
                  disabled={isSubmitting}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className={styles.commentSubmit}
        >
          <Send className={styles.commentSubmitIcon} />
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
