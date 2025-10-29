import styles from "./Input.module.css";

const InputLabel = ({ label }) => {
  if (!label) return null;

  return <label className={styles.label}>{label}</label>;
};

export default InputLabel;
