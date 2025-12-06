import styles from "./ModalContent.module.css";

const ModalContent = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

export default ModalContent;
