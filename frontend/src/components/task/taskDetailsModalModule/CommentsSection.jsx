import { MessageSquare, Send } from "lucide-react";
import { getInitials, generateColor, formatDate } from "../../../utils/helpers";

const CommentsSection = ({
  comments,
  newComment,
  setNewComment,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Comments {comments?.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment List */}
      {comments && comments.length > 0 && (
        <div className="space-y-3 mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0"
                style={{
                  backgroundColor: generateColor(comment.user?.name || "User"),
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
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default CommentsSection;
