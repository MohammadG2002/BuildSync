import { useState, useRef } from "react";
import {
  ModalHeader,
  DescriptionSection,
  MetadataGrid,
  TagsSection,
  AttachmentsSection,
  CommentsSection,
  ModalFooter,
} from "./taskDetailsModalModule";
import styles from "./taskDetailsModalModule/TaskDetailsModal.module.css";

const TaskDetailsModal = ({
  task,
  onClose,
  onUpdate,
  onAddComment,
  onDeleteAttachment,
  onAddAttachment,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    task?.description || ""
  );
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [commentFiles, setCommentFiles] = useState([]);
  const fileInputRef = useRef(null);
  const commentFileInputRef = useRef(null);

  if (!task) return null;

  const handleStatusChange = (newStatus) => {
    onUpdate?.({ _id: task._id, status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate?.({ _id: task._id, priority: newPriority });
  };

  const handleSaveDescription = () => {
    onUpdate?.({ _id: task._id, description: editedDescription });
    setIsEditingDescription(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment?.(task._id, newComment, commentFiles);
      setNewComment("");
      setCommentFiles([]);
      // Reset file input
      if (commentFileInputRef.current) {
        commentFileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setCommentFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveCommentFile = (index) => {
    setCommentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingFile(true);
    try {
      // Upload files one by one
      for (const file of files) {
        await onAddAttachment?.(file);
      }
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setIsUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <ModalHeader
          task={task}
          onClose={onClose}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />

        <div className={styles.content}>
          <DescriptionSection
            description={task.description}
            isEditing={isEditingDescription}
            editedDescription={editedDescription}
            onEdit={() => setIsEditingDescription(true)}
            onSave={handleSaveDescription}
            onCancel={() => {
              setIsEditingDescription(false);
              setEditedDescription(task.description || "");
            }}
            onChange={(e) => setEditedDescription(e.target.value)}
          />

          <MetadataGrid task={task} />
          <TagsSection tags={task.tags} />

          <AttachmentsSection
            attachments={task.attachments}
            onAddFile={handleFileUpload}
            onDeleteAttachment={onDeleteAttachment}
            taskId={task._id}
            fileInputRef={fileInputRef}
            isUploading={isUploadingFile}
          />

          <CommentsSection
            comments={task.comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleAddComment}
            isSubmitting={isSubmittingComment}
            selectedFiles={commentFiles}
            onFileSelect={handleCommentFileSelect}
            onRemoveFile={handleRemoveCommentFile}
            fileInputRef={commentFileInputRef}
          />
        </div>

        <ModalFooter createdAt={task.createdAt} updatedAt={task.updatedAt} />
      </div>
    </div>
  );
};

export default TaskDetailsModal;
