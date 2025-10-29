import { AlertTriangle } from "lucide-react";
import styles from "./ErrorBoundary.module.css";

const ErrorIcon = () => {
  return (
    <div className={styles.iconContainer}>
      <AlertTriangle className={styles.icon} />
    </div>
  );
};

export default ErrorIcon;
