import { useEffect } from "react";
import {
  modalSizes,
  getModalClassName,
  ModalBackdrop,
  ModalHeader,
  ModalContent,
} from "./modal/index";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <ModalBackdrop onClick={onClose} />

      <div className={getModalClassName(size, modalSizes)}>
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
