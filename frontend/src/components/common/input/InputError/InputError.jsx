import styles from "./InputError.module.css";

const InputError = ({ error }) => {
  if (!error) return null;

  return <p className={styles.error}>{error}</p>;
};

export default InputError;
