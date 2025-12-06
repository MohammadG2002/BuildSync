import ErrorIcon from "../ErrorIcon/ErrorIcon";
import ErrorDetails from "../ErrorDetails/ErrorDetails";
import ErrorActions from "../ErrorActions/ErrorActions";
import styles from "./ErrorFallback.module.css";

const ErrorFallback = ({ error, errorInfo, onReset }) => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <ErrorIcon />

          <h1 className={styles.title}>Oops! Something went wrong</h1>

          <p className={styles.description}>
            We're sorry, but something unexpected happened. Don't worry, your
            data is safe.
          </p>

          <ErrorDetails error={error} errorInfo={errorInfo} />

          <ErrorActions onReset={onReset} onGoHome={handleGoHome} />
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
