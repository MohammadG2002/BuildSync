// Default configuration for FileUpload component
const fileUploadConfig = {
  maxFiles: 5,
  maxSize: 10, // MB
  acceptedTypes: [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ],
  multiple: true,
  errorDisplayDuration: 5000, // milliseconds
};

export default fileUploadConfig;
