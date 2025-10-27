import { Loader2 } from "lucide-react";
import { memo } from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-primary-300 dark:bg-primary-500 dark:hover:bg-primary-600 dark:disabled:bg-primary-800",
    secondary:
      "bg-gray-200 text-gray-800 dark:text-gray-100 hover:bg-gray-300 disabled:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800",
    outline:
      "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-primary-300 disabled:text-primary-300 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:disabled:border-primary-800 dark:disabled:text-primary-800",
    danger:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:disabled:bg-red-800",
    ghost:
      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 disabled:text-gray-400 dark:text-gray-500 dark:text-gray-300 dark:hover:bg-gray-800 dark:disabled:text-gray-600 dark:text-gray-400 dark:text-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default memo(Button);
