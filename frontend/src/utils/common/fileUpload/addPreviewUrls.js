// Add preview URLs to image files
const addPreviewUrls = (files) => {
  return files.map((file) => {
    if (file.type.startsWith("image/")) {
      return Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
    }
    return file;
  });
};

export default addPreviewUrls;
