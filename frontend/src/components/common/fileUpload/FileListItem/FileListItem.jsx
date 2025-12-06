import { X, Eye } from "lucide-react";
import getFileIcon from "../../../../utils/common/fileUpload/getFileIcon";
import formatFileSize from "../../../../utils/helpers/formatFileSize";
import styles from "./FileListItem.module.css";

const FileListItem = ({ file, index, onRemove, onPreview }) => {
  const FileIcon = getFileIcon(file);
  const isImage = file.type.startsWith("image/");

  return (
    <div className={styles.fileItem}>
      {/* Thumbnail/Icon */}
      <div className={styles.fileItemThumbnail}>
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className={styles.fileItemThumbnailImage}
          />
        ) : (
          <FileIcon className={styles.fileItemIcon} />
        )}
      </div>

      {/* File Info */}
      <div className={styles.fileItemInfo}>
        <p className={styles.fileItemName}>{file.name}</p>
        <p className={styles.fileItemSize}>{formatFileSize(file.size)}</p>
      </div>

      {/* Actions */}
      <div className={styles.fileItemActions}>
        {/* Preview Button (only for images) */}
        {isImage && (
          <button
            type="button"
            onClick={() => onPreview(file)}
            className={`${styles.fileItemButton} ${styles.fileItemPreviewButton}`}
            title="Preview"
          >
            <Eye className={styles.fileItemButtonIcon} />
          </button>
        )}

        {/* Remove Button */}
        <button
          type="button"
          onClick={() => onRemove(index)}
          className={`${styles.fileItemButton} ${styles.fileItemRemoveButton}`}
          title="Remove"
        >
          <X className={styles.fileItemButtonIcon} />
        </button>
      </div>
    </div>
  );
};

export default FileListItem;
