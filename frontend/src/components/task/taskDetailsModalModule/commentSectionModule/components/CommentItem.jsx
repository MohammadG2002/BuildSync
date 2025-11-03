import React from "react";
import { MoreVertical, ThumbsUp, ThumbsDown } from "lucide-react";
import styles from "../../TaskDetailsModal.module.css";
import { getRelativeTime } from "../../../../../utils/helpers";
import { useAuth } from "../../../../../hooks/useAuth";
import CommentAttachmentItem from "./CommentAttachmentItem";

const CommentItem = ({
  comment,
  onUpdateComment,
  onDeleteComment,
  onReactComment,
  // props intentionally minimal for simple display
}) => {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id;
  const authorName =
    comment.user?.name || comment.user?.email || "Unknown User";
  const createdAt = comment.createdAt;
  const hasText = (comment.content || "").trim().length > 0;
  const nameLine = hasText ? comment.content : "";
  const attachments = Array.isArray(comment.attachments)
    ? comment.attachments
    : [];
  const likes = Array.isArray(comment.likes) ? comment.likes : [];
  const dislikes = Array.isArray(comment.dislikes) ? comment.dislikes : [];
  const likedByMe = currentUserId
    ? likes.some((u) => String(u?._id || u) === String(currentUserId))
    : false;
  const dislikedByMe = currentUserId
    ? dislikes.some((u) => String(u?._id || u) === String(currentUserId))
    : false;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(comment.content || "");
  const menuRef = React.useRef(null);
  const [showConfirm, setShowConfirm] = React.useState(false);

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const handleStartEdit = () => {
    setEditText(comment.content || "");
    setIsEditing(true);
    setMenuOpen(false);
  };

  const handleSaveEdit = async () => {
    const trimmed = (editText || "").trim();
    if (!trimmed || !onUpdateComment || !comment._id) {
      setIsEditing(false);
      return;
    }
    await onUpdateComment(comment._id, { content: trimmed });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDeleteComment || !comment._id) return;
    setMenuOpen(false);
    await onDeleteComment(comment._id);
    setShowConfirm(false);
  };

  const handleLike = async () => {
    if (!onReactComment || !comment._id) return;
    const action = likedByMe ? "clear" : "like";
    await onReactComment(comment._id, action);
  };

  const handleDislike = async () => {
    if (!onReactComment || !comment._id) return;
    const action = dislikedByMe ? "clear" : "dislike";
    await onReactComment(comment._id, action);
  };

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flex: 1,
          }}
        >
          <span className={styles.commentAuthor}>{authorName}</span>
          <span className={styles.commentDate}>
            {createdAt ? ` - ${getRelativeTime(createdAt)}` : ""}
          </span>
        </div>
        <div className={styles.commentMenuContainer} ref={menuRef}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Comment actions"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className={styles.commentMenu} role="menu">
              <button
                type="button"
                className={styles.commentMenuItem}
                onClick={handleStartEdit}
              >
                Edit
              </button>
              <button
                type="button"
                className={styles.commentMenuItemDanger}
                onClick={() => setShowConfirm(true)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {attachments.length > 0 && (
        <div className={styles.attachmentsList}>
          {attachments.map((att, idx) => (
            <div
              key={att._id || att.url || idx}
              className={styles.attachmentItem}
            >
              <CommentAttachmentItem attachment={att} />
            </div>
          ))}
        </div>
      )}
      {isEditing ? (
        <div className={styles.attachmentComment}>
          <div className={styles.attachmentInfo} style={{ width: "100%" }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              className={styles.commentInput}
              style={{ width: "100%" }}
            />
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <button
                className={styles.saveButton}
                type="button"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button
                className={styles.cancelButton}
                type="button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        hasText && (
          <div className={styles.attachmentComment}>
            <div
              className={styles.attachmentCommentContent}
              title={comment.content}
            >
              <div className={styles.attachmentInfo}>
                <p className={styles.attachmentName}>{nameLine}</p>
              </div>
            </div>
          </div>
        )
      )}
      {/* Reactions bar */}
      <div className={styles.reactionBar}>
        <button
          type="button"
          className={`${styles.reactionButton} ${
            likedByMe ? styles.reactionActive : ""
          }`}
          onClick={handleLike}
          aria-pressed={likedByMe}
          title={likedByMe ? "Unlike" : "Like"}
        >
          <ThumbsUp size={14} />
          <span className={styles.reactionCount}>{likes.length || 0}</span>
        </button>
        <button
          type="button"
          className={`${styles.reactionButton} ${
            dislikedByMe ? styles.reactionActive : ""
          }`}
          onClick={handleDislike}
          aria-pressed={dislikedByMe}
          title={dislikedByMe ? "Remove dislike" : "Dislike"}
        >
          <ThumbsDown size={14} />
          <span className={styles.reactionCount}>{dislikes.length || 0}</span>
        </button>
      </div>
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmDialog} role="dialog" aria-modal="true">
            <div
              className={styles.sectionHeader}
              style={{ marginBottom: "0.75rem" }}
            >
              <span className={styles.sectionTitle}>Delete comment?</span>
            </div>
            <p
              className={styles.metadataText}
              style={{ marginBottom: "0.75rem" }}
            >
              This will permanently remove the comment and its attachments.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
