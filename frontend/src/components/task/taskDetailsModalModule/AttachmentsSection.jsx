import { Paperclip, Download, Trash2 } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import { formatFileSize } from "./formatFileSize";

const AttachmentsSection = ({
  attachments,
  onAddFile,
  onDeleteAttachment,
  taskId,
  fileInputRef,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Attachments {attachments?.length > 0 && `(${attachments.length})`}
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
          onChange={onAddFile}
          className="hidden"
        />
      </div>
      {attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map((attachment, index) => (
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
                    {attachment.uploadedAt && formatDate(attachment.uploadedAt)}
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
                  onClick={() => onDeleteAttachment?.(taskId, attachment._id)}
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
  );
};

export default AttachmentsSection;
