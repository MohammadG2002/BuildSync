import { AlertCircle } from "lucide-react";

const ErrorMessages = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
            Upload Errors
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessages;
