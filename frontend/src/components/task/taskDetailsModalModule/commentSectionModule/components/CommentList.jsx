import React from "react";
import CommentItem from "./CommentItem";

// Expects an array of comments only
const CommentList = ({ comments, onUpdateComment, onDeleteComment }) => {
  const items = Array.isArray(comments) ? comments : [];
  return (
    <div style={{ width: "100%" }}>
      {items.map((c) => (
        <CommentItem
          key={`comment-${c._id || Math.random()}`}
          comment={c}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;
