import styles from "./Sidebar.module.css";

const SidebarBackdrop = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return <div className={styles.backdrop} onClick={onClose} />;
};

export default SidebarBackdrop;
