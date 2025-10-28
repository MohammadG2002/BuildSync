import { X, Eye } from "lucide-react";
import getFileIcon from "./getFileIcon";
import formatFileSize from "./formatFileSize";

const FileListItem = ({ file, index, onRemove, onPreview }) => {
  const FileIcon = getFileIcon(file);
  const isImage = file.type.startsWith("image/");

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group">
      {/* Thumbnail/Icon */}
      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Preview Button (only for images) */}
        {isImage && (
          <button
            type="button"
            onClick={() => onPreview(file)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
            title="Preview"
          >
            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          title="Remove"
        >
          <X className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
