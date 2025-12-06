import styles from "./ModalBackdrop.module.css";

const ModalBackdrop = ({ onClick }) => {
  return <div className={styles.backdrop} onClick={onClick} />;
};

export default ModalBackdrop;
