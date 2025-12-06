import { useEffect } from "react";
import ModalBackdrop from "../ModalBackdrop/ModalBackdrop";
import ModalHeader from "../ModalHeader/ModalHeader";
import ModalContent from "../ModalContent/ModalContent";
import styles from "./Modal.module.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalClasses = [styles.modal, styles[size]].filter(Boolean).join(" ");

  return (
    <div className={styles.modalContainer}>
      <ModalBackdrop onClick={onClose} />

      <div className={modalClasses}>
        <ModalHeader
          title={title}
          showCloseButton={showCloseButton}
          onClose={onClose}
        />
        <ModalContent>{children}</ModalContent>
      </div>
    </div>
  );
};

export default Modal;
