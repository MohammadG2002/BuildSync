// Handle drop event for file upload
const handleDrop = (e, setDragActive, handleFiles) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    handleFiles(Array.from(e.dataTransfer.files));
  }
};

export default handleDrop;
