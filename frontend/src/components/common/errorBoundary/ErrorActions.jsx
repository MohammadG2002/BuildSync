import Button from "../Button";

const ErrorActions = ({ onReset, onGoHome }) => {
  return (
    <div className="flex gap-3">
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
