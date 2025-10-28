// Process and validate new files
const handleFiles = (
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
  errorDisplayDuration
) => {
  const { validFiles, errors: validationErrors } = validateFiles(
    newFiles,
    files,
    maxFiles,
    maxSize,
    acceptedTypes
  );

  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    setTimeout(() => setErrors([]), errorDisplayDuration);
  }

  if (validFiles.length === 0) return;

  const filesWithPreviews = addPreviewUrls(validFiles);
  const updatedFiles = [...files, ...filesWithPreviews];
  setFiles(updatedFiles);
  onFilesSelected?.(updatedFiles);
};

export default handleFiles;
