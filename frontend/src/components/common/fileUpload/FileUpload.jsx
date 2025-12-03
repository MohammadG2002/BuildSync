import { useState, useRef, useEffect } from "react";
import {
  fileUploadConfig,
  validateFiles,
  addPreviewUrls,
  ErrorMessages,
  DropZone,
  FileList,
  FilePreviewModal,
  handleDrag as handleDragUtil,
  handleDrop as handleDropUtil,
  handleChange as handleChangeUtil,
  handleFiles as handleFilesUtil,
  removeFile as removeFileUtil,
  cleanupPreviews,
} from "./index";
import styles from "./FileUpload.module.css";

const FileUpload = ({
  onFilesSelected,
  maxFiles = fileUploadConfig.maxFiles,
  maxSize = fileUploadConfig.maxSize,
  acceptedTypes = fileUploadConfig.acceptedTypes,
  multiple = fileUploadConfig.multiple,
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => cleanupPreviews(files);
  }, [files]);

  const handleFiles = (newFiles) => {
    handleFilesUtil(
      newFiles,
      files,
      maxFiles,
      maxSize,
      acceptedTypes,
      validateFiles,
      addPreviewUrls,
      setErrors,
      setFiles,
      onFilesSelected,
      fileUploadConfig.errorDisplayDuration
    );
  };

  const handleDrag = (e) => {
    handleDragUtil(e, setDragActive);
  };

  const handleDrop = (e) => {
    handleDropUtil(e, setDragActive, handleFiles);
  };

  const handleChange = (e) => {
    handleChangeUtil(e, handleFiles);
  };

  const removeFile = (index) => {
    removeFileUtil(index, files, setFiles, onFilesSelected);
  };

  return (
    <div className={styles.container}>
      <ErrorMessages errors={errors} />

      <DropZone
        fileInputRef={fileInputRef}
        dragActive={dragActive}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onChange={handleChange}
        multiple={multiple}
        acceptedTypes={acceptedTypes}
        maxFiles={maxFiles}
        maxSize={maxSize}
      />

      <FileList
        files={files}
        onRemove={removeFile}
        onPreview={setPreviewFile}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
};

export default FileUpload;
