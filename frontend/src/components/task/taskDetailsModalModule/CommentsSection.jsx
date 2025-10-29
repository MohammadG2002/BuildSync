import { MessageSquare, Send } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";
import styles from "./TaskDetailsModal.module.css";

const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  onSubmit,
  isSubmitting,
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      <form onSubmit={onSubmit} className={styles.commentForm}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className={styles.commentInput}
          disabled={isSubmitting}
        />
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
