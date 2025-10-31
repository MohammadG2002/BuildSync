// Remove a file from the upload list
const removeFile = (index, files, setFiles, onFilesSelected) => {
  const fileToRemove = files[index];
  if (fileToRemove.preview) {
    URL.revokeObjectURL(fileToRemove.preview);
  }
  const updatedFiles = files.filter((_, i) => i !== index);
  setFiles(updatedFiles);
  onFilesSelected?.(updatedFiles);
};

export default removeFile;
