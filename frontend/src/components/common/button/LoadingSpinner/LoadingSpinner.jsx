import styles from "./LoadingSpinner.module.css";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return <Loader2 className={styles.spinner} />;
};

export default LoadingSpinner;
