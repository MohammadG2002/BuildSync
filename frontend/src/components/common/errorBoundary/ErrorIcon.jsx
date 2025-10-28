import { AlertTriangle } from "lucide-react";

const ErrorIcon = ({ className = "" }) => {
  return (
    <div
      className={`w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center ${className}`}
    >
      <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
    </div>
  );
};

export default ErrorIcon;
