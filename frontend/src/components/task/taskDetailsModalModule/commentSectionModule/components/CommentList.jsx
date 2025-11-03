import React from "react";
import CommentItem from "./CommentItem";
import styles from "../../TaskDetailsModal.module.css";
import { getInitials, generateColor } from "../../../../../utils/helpers";

// Expects an array of comments only
const CommentList = ({
  comments,
  onUpdateComment,
  onDeleteComment,
  onReactComment,
}) => {
  const items = Array.isArray(comments) ? comments : [];
  return (
    <div style={{ width: "100%" }}>
      {items.map((c) => {
        const authorName = c?.user?.name || c?.user?.email || "User";
        const avatarBg = generateColor(authorName);
        const initials = getInitials(authorName);
        return (
          <div
            key={`comment-${c._id || Math.random()}`}
            className={styles.comment}
          >
            <div
              className={styles.commentAvatar}
              style={{ backgroundColor: avatarBg }}
              title={authorName}
            >
              {initials}
            </div>
            <div className={styles.commentContent}>
              <CommentItem
                comment={c}
                onUpdateComment={onUpdateComment}
                onDeleteComment={onDeleteComment}
                onReactComment={onReactComment}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
