import styles from "./Button.module.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { getFontSize } from "./sizeMap";

const Button = ({
  children,
  size = 20,
  variant = "primary",
  width = "fit-content",
  height = "fit-content",
  loading = false,
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]}`}
      style={{ fontSize: getFontSize(size), width: width, height: height }}
      disabled={loading}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default Button;
