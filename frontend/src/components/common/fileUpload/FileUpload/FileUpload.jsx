import { useState, useRef, useEffect } from "react";
import fileUploadConfig from "../../../../utils/common/fileUpload/fileUploadConfig";
import validateFiles from "../../../../utils/common/fileUpload/validateFiles";
import addPreviewUrls from "../../../../utils/common/fileUpload/addPreviewUrls";
import handleDragUtil from "../../../../utils/common/fileUpload/handleDrag";
import handleDropUtil from "../../../../utils/common/fileUpload/handleDrop";
import handleChangeUtil from "../../../../utils/common/fileUpload/handleChange";
import handleFilesUtil from "../../../../utils/common/fileUpload/handleFiles";
import removeFileUtil from "../../../../utils/common/fileUpload/removeFile";
import cleanupPreviews from "../../../../utils/common/fileUpload/cleanupPreviews";
import ErrorMessages from "../ErrorMessages/ErrorMessages";
import DropZone from "../DropZone/DropZone";
import FileList from "../FileList/FileList";
import FilePreviewModal from "../FilePreviewModal/FilePreviewModal";
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
