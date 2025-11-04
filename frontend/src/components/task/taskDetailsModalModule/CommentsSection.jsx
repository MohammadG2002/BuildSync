import React from "react";
import { Paperclip } from "lucide-react";
import styles from "./TaskDetailsModal.module.css";
import CommentInputBar from "./commentSectionModule/components/CommentInputBar";
import CommentList from "./commentSectionModule/components/CommentList";
import handleFileSelect from "./commentSectionModule/utils/handleFileSelect";
import handleClearQueued from "./commentSectionModule/utils/handleClearQueued";
import handleUnifiedSend from "./commentSectionModule/utils/handleUnifiedSend";

// CommentsSection (Test-like behavior): queued attachments + auto-send comment + combined feed
const CommentsSection = ({
  attachments,
  comments = [],
  onAddFile,
  onDeleteAttachment,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  taskId,
  fileInputRef,
  isUploading,
  readOnly = false,
  currentUserId,
  canModerateComments = false,
  onReactComment,
}) => {
  const [newComment, setNewComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  // Queue selected files instead of uploading immediately
  const [queuedFiles, setQueuedFiles] = React.useState([]);
  const [isSendingQueued, setIsSendingQueued] = React.useState(false);

  // Auto-scroll: keep the comments view pinned to the bottom
  const bottomRef = React.useRef(null);
  const didInitScrollRef = React.useRef(false);

  React.useEffect(() => {
    // Scroll to bottom on mount and when the number of comments changes
    if (!bottomRef.current) return;
    const behavior = didInitScrollRef.current ? "smooth" : "auto";
    bottomRef.current.scrollIntoView({ behavior, block: "end" });
    didInitScrollRef.current = true;
  }, [comments?.length]);

  // Handlers extracted to utils; we pass state via params when invoking

  // Combined feed of attachments and comments (separate items)
  // deprecated combined feed; now rendering comments only with per-comment attachments

  return (
    <div>
      {Array.isArray(comments) && comments.length > 0 ? (
        <div className={styles.attachmentsList}>
          <CommentList
            comments={comments}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
            onReactComment={onReactComment}
            readOnly={readOnly}
            currentUserId={currentUserId}
            canModerateComments={canModerateComments}
          />
        </div>
      ) : (
        <p className={styles.metadataTextMuted}>No comments</p>
      )}
      {/* Bottom sentinel used for auto-scroll to bottom */}
      <div ref={bottomRef} />

      <CommentInputBar
        newComment={newComment}
        onChange={setNewComment}
        onUnifiedSend={(e) =>
          handleUnifiedSend(e, {
            readOnly,
            queuedFiles,
            onAddFile,
            setIsSendingQueued,
            setQueuedFiles,
            newComment,
            setIsSubmitting,
            setNewComment,
            onAddComment,
            taskId,
          })
        }
        fileInputRef={fileInputRef}
        onFileSelect={(e) => handleFileSelect(e, { readOnly, setQueuedFiles })}
        onClearQueued={() => handleClearQueued({ setQueuedFiles })}
        queuedFilesLength={queuedFiles.length}
        readOnly={readOnly}
        isSubmitting={isSubmitting}
        isUploading={isUploading}
        isSendingQueued={isSendingQueued}
      />
    </div>
  );
};

export default CommentsSection;
