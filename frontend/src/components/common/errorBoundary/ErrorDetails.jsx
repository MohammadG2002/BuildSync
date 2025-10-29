import styles from "./ErrorBoundary.module.css";

const ErrorDetails = ({ error, errorInfo }) => {
  if (process.env.NODE_ENV !== "development" || !error) {
    return null;
  }

  return (
    <div className={styles.details}>
      <details className={styles.detailsToggle}>
        <summary className={styles.detailsSummary}>
          Error Details (Development Only)
        </summary>
        <div className={styles.detailsError}>
          {error.toString()}
          {errorInfo && (
            <div className={styles.detailsStack}>
              {errorInfo.componentStack}
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default ErrorDetails;
