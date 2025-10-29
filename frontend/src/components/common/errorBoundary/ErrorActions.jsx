import Button from "../Button";
import styles from "./ErrorBoundary.module.css";

const ErrorActions = ({ onReset, onGoHome }) => {
  return (
    <div className={styles.actions}>
      <Button variant="primary" onClick={onReset}>
        Try Again
      </Button>
      <Button variant="secondary" onClick={onGoHome}>
        Go Home
      </Button>
    </div>
  );
};

export default ErrorActions;
