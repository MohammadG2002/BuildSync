// Base styles applied to all buttons
export const baseStyles =
  "font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2";

// Button variant styles
export const variants = {
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
  success:
    "bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:disabled:bg-green-800",
  warning:
    "bg-yellow-600 text-white hover:bg-yellow-700 disabled:bg-yellow-300 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:disabled:bg-yellow-800",
  info: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800",
};

// Button size styles
export const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

// Generate button className
export const getButtonClassName = (variant, size, className) => {
  return `${baseStyles} ${variants[variant] || variants.primary} ${
    sizes[size] || sizes.md
  } ${className}`;
};
