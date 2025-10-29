import FileListItem from "./FileListItem";
import styles from "./FileUpload.module.css";

const FileList = ({ files, onRemove, onPreview }) => {
  if (files.length === 0) return null;

  return (
    <div className={styles.fileList}>
      {files.map((file, index) => (
        <FileListItem
          key={index}
          file={file}
          index={index}
          onRemove={onRemove}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};

export default FileList;
