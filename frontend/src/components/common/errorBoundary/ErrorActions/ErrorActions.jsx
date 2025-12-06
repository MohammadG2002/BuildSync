import Button from "../../button/Button/Button";
import styles from "./ErrorActions.module.css";

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
