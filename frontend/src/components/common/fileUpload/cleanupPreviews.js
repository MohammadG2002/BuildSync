// Cleanup preview URLs when component unmounts
const cleanupPreviews = (files) => {
  files.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
};

export default cleanupPreviews;
