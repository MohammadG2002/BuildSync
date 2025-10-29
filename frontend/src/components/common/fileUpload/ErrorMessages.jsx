import { AlertCircle } from "lucide-react";
import styles from "./FileUpload.module.css";

const ErrorMessages = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className={styles.errors}>
      <div className={styles.errorsContent}>
        <AlertCircle className={styles.errorsIcon} />
        <div className={styles.errorsBody}>
          <p className={styles.errorsTitle}>Upload Errors</p>
          <ul className={styles.errorsList}>
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessages;
