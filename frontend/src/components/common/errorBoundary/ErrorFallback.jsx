import ErrorIcon from "./ErrorIcon";
import ErrorDetails from "./ErrorDetails";
import ErrorActions from "./ErrorActions";

const ErrorFallback = ({ error, errorInfo, onReset }) => {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          <ErrorIcon className="mb-4" />

          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Oops! Something went wrong
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
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
