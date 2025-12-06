import Modal from "../../modal/Modal/Modal";
import formatFileSize from "../../../../utils/helpers/formatFileSize";
import styles from "./FilePreviewModal.module.css";

const FilePreviewModal = ({ file, onClose }) => {
  if (!file) return null;

  return (
    <Modal isOpen={!!file} onClose={onClose} title={file.name} size="large">
      <div className={styles.previewContainer}>
        <img
          src={file.preview}
          alt={file.name}
          className={styles.previewImage}
        />
      </div>
      <div className={styles.previewInfo}>
        <p>Size: {formatFileSize(file.size)}</p>
        <p>Type: {file.type}</p>
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
