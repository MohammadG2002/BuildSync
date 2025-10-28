const ErrorDetails = ({ error, errorInfo }) => {
  if (process.env.NODE_ENV !== "development" || !error) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <details className="text-left bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Error Details (Development Only)
        </summary>
        <div className="text-xs text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap break-words">
          {error.toString()}
          {errorInfo && (
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              {errorInfo.componentStack}
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default ErrorDetails;
