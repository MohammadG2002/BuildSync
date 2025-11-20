import React from "react";
import CommentItem from "./CommentItem";
import styles from "../../TaskDetailsModal.module.css";
import UserAvatar from "../../../../common/UserAvatar";

// Expects an array of comments only
const CommentList = ({
  comments,
  onUpdateComment,
  onDeleteComment,
  onReactComment,
  readOnly = false,
  currentUserId,
  canModerateComments = false,
}) => {
  const items = Array.isArray(comments) ? comments : [];
  return (
    <div style={{ width: "100%" }}>
      {items.map((c) => {
        const authorName = c?.user?.name || c?.user?.email || "User";
        return (
          <div
            key={`comment-${c._id || Math.random()}`}
            className={styles.comment}
          >
            <UserAvatar
              name={authorName}
              avatar={c?.user?.avatar}
              className={styles.commentAvatar}
              title={authorName}
            />
            <div className={styles.commentContent}>
              <CommentItem
                comment={c}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onReactComment={onReactComment}
                readOnly={readOnly}
                currentUserId={currentUserId}
                canModerateComments={canModerateComments}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
