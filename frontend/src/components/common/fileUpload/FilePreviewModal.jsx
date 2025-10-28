import Modal from "../Modal";
import formatFileSize from "./formatFileSize";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <Modal isOpen={!!file} onClose={onClose} title={file.name} size="large">
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
        <img
          src={file.preview}
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain rounded"
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Size: {formatFileSize(file.size)}</p>
        <p>Type: {file.type}</p>
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
