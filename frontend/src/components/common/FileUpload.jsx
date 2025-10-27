import { useState, useRef, useEffect } from "react";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  FileSpreadsheet,
  Eye,
  AlertCircle,
} from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

const FileUpload = ({
  onFilesSelected,
  maxFiles = 5,
  maxSize = 10, // MB
  acceptedTypes = [
    "image/*",
    "application/pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
  ],
  multiple = true,
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Generate preview URLs for images
  useEffect(() => {
    // Cleanup preview URLs on unmount
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles) => {
    const validationErrors = [];

    // Validate file count
    if (files.length + newFiles.length > maxFiles) {
      validationErrors.push(`Maximum ${maxFiles} files allowed`);
      setErrors(validationErrors);
      return;
    }

    // Validate file size and type
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        validationErrors.push(`${file.name}: File size exceeds ${maxSize}MB`);
        return false;
      }

      // Check if file type is accepted
      const isAccepted = acceptedTypes.some((type) => {
        if (type.includes("*")) {
          // Handle wildcard types like "image/*"
          const baseType = type.split("/")[0];
          return file.type.startsWith(baseType);
        }
        // Handle specific extensions like ".pdf"
        if (type.startsWith(".")) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        // Handle MIME types like "application/pdf"
        return file.type === type;
      });

      if (!isAccepted) {
        validationErrors.push(`${file.name}: File type not supported`);
        return false;
      }

      return true;
    });

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setTimeout(() => setErrors([]), 5000); // Clear errors after 5 seconds
    }

    // Add preview URLs for images
    const filesWithPreviews = validFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      }
      return file;
    });

    const updatedFiles = [...files, ...filesWithPreviews];
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  const removeFile = (index) => {
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.includes("pdf")) return FileText;
    if (file.type.includes("sheet") || file.type.includes("excel"))
      return FileSpreadsheet;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Upload Errors
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(",")}
          onChange={handleChange}
          className="hidden"
        />

        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            dragActive ? "text-primary-600" : "text-gray-400 dark:text-gray-500"
          }`}
        />

        <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-4">
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

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file);
            const isImage = file.type.startsWith("image/");

            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg group"
              >
                {/* Thumbnail/Icon */}
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {isImage && file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* Preview Button (only for images) */}
                  {isImage && (
                    <button
                      type="button"
                      onClick={() => setPreviewFile(file)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={previewFile.name}
          size="large"
        >
          <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <img
              src={previewFile.preview}
              alt={previewFile.name}
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Size: {formatFileSize(previewFile.size)}</p>
            <p>Type: {previewFile.type}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FileUpload;
