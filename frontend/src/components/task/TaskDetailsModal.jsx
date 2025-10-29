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
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    task?.description || ""
  );
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const fileInputRef = useRef(null);

  if (!task) return null;

  const handleStatusChange = (newStatus) => {
    onUpdate?.({ ...task, status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdate?.({ ...task, priority: newPriority });
  };

  const handleSaveDescription = () => {
    onUpdate?.({ ...task, description: editedDescription });
    setIsEditingDescription(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      await onAddComment?.(task._id, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files to upload:", files);
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
          />

          <CommentsSection
            comments={task.comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmit={handleAddComment}
            isSubmitting={isSubmittingComment}
          />
        </div>

        <ModalFooter createdAt={task.createdAt} updatedAt={task.updatedAt} />
      </div>
    </div>
  );
};

export default TaskDetailsModal;
