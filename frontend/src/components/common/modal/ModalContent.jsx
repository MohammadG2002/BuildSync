import styles from "./Modal.module.css";

const ModalContent = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export default ModalContent;
