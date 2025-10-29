import styles from "./Auth.module.css";

const FormDivider = ({ text = "Or" }) => {
  return (
    <div className={styles.divider}>
      <div className={styles.dividerLine}>
        <div className={styles.dividerBorder}></div>
      </div>
      <div className={styles.dividerText}>
        <span className={styles.dividerTextSpan}>{text}</span>
      </div>
    </div>
  );
};

export default FormDivider;
