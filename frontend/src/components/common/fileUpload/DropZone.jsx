import { Upload } from "lucide-react";
import Button from "../Button";
import styles from "./FileUpload.module.css";

const DropZone = ({
  fileInputRef,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChange,
  multiple,
  acceptedTypes,
  maxFiles,
  maxSize,
}) => {
  const dropZoneClass = dragActive
    ? `${styles.dropZone} ${styles.dropZoneActive}`
    : styles.dropZone;
  const iconClass = dragActive
    ? `${styles.uploadIcon} ${styles.uploadIconActive}`
    : styles.uploadIcon;

  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={dropZoneClass}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(",")}
        onChange={onChange}
        className={styles.dropZoneInput}
      />

      <Upload className={iconClass} />

      <p className={styles.dropZoneTitle}>Drop files here or click to upload</p>
      <p className={styles.dropZoneSubtitle}>
        Maximum {maxFiles} files, up to {maxSize}MB each
      </p>

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        Choose Files
      </Button>
    </div>
  );
};

export default DropZone;
