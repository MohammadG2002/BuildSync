import { Loader2 } from "lucide-react";
import styles from "./LoaderSpinner.module.css";

const LoaderSpinner = ({ size = "md", text }) => {
  return (
    <div className={styles.spinnerContainer}>
      <Loader2
        className={`${styles.spinner} ${
          styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`]
        }`}
      />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default LoaderSpinner;
