import { useState, useRef } from "react";
import {
  X,
  Calendar,
  User,
  Tag,
  Flag,
  Clock,
  CheckCircle,
  Paperclip,
  MessageSquare,
  Download,
  Trash2,
  Send,
  Edit2,
  Save,
} from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../utils/helpers";

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

  const statusColors = {
    todo: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
    "in-progress":
      "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600",
    review:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600",
    completed:
      "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600",
    blocked:
      "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-600",
  };

  const priorityColors = {
    low: "text-gray-600 dark:text-gray-400",
    medium: "text-blue-600 dark:text-blue-400",
    high: "text-orange-600 dark:text-orange-400",
    urgent: "text-red-600 dark:text-red-400",
  };

  const priorityDots = {
    low: "bg-gray-400",
    medium: "bg-blue-400",
    high: "bg-orange-400",
    urgent: "bg-red-400",
  };

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
    // Handle file upload logic here
    console.log("Files to upload:", files);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {task.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Dropdown */}
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`px-3 py-1 text-sm font-medium rounded border cursor-pointer ${
                  statusColors[task.status]
                }`}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* Priority Dropdown */}
              <select
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className={`px-3 py-1 text-sm font-medium rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 cursor-pointer flex items-center gap-1 ${
                  priorityColors[task.priority]
                }`}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Description
              </h3>
              {!isEditingDescription && (
                <button
                  onClick={() => setIsEditingDescription(true)}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
            {isEditingDescription ? (
              <div>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 min-h-[100px]"
                  placeholder="Add a description..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveDescription}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingDescription(false);
                      setEditedDescription(task.description || "");
                    }}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Assignee */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Assignee
                </h3>
              </div>
              {task.assignedTo || task.assignee ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      backgroundColor: generateColor(
                        task.assignedTo?.name ||
                          task.assignee?.name ||
                          "Unassigned"
                      ),
                    }}
                  >
                    {getInitials(
                      task.assignedTo?.name || task.assignee?.name || "U"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {task.assignedTo?.name || task.assignee?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.assignedTo?.email || task.assignee?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unassigned
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Due Date
                </h3>
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {task.dueDate ? formatDate(task.dueDate) : "No due date"}
              </p>
            </div>

            {/* Created By */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Created By
                </h3>
              </div>
              {task.createdBy ? (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{
                      backgroundColor: generateColor(
                        task.createdBy.name || "U"
                      ),
                    }}
                  >
                    {getInitials(task.createdBy.name || "U")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {task.createdBy.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {task.createdBy.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Unknown
                </p>
              )}
            </div>

            {/* Completed At */}
            {task.completedAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Completed At
                  </h3>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100">
                  {formatDate(task.completedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-medium rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Attachments{" "}
                  {task.attachments?.length > 0 &&
                    `(${task.attachments.length})`}
                </h3>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Add File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {task.attachments && task.attachments.length > 0 ? (
              <div className="space-y-2">
                {task.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {attachment.originalName || attachment.filename}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {attachment.size && formatFileSize(attachment.size)} •{" "}
                          {attachment.uploadedAt &&
                            formatDate(attachment.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {attachment.url && (
                        <a
                          href={attachment.url}
                          download
                          className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() =>
                          onDeleteAttachment?.(task._id, attachment._id)
                        }
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No attachments
              </p>
            )}
          </div>

          {/* Comments */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Comments{" "}
                {task.comments?.length > 0 && `(${task.comments.length})`}
              </h3>
            </div>

            {/* Comment List */}
            {task.comments && task.comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {task.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                      style={{
                        backgroundColor: generateColor(
                          comment.user?.name || "User"
                        ),
                      }}
                    >
                      {getInitials(comment.user?.name || "U")}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {comment.user?.name || "Unknown User"}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {comment.createdAt && formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmittingComment ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Created {formatDate(task.createdAt)}</span>
            <span>Updated {formatDate(task.updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;
