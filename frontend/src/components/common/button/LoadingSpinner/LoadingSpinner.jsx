import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-6 h-6",
  };

  return (
    <Loader2
      className={`${sizeClasses[size] || sizeClasses.md} animate-spin`}
    />
  );
};

export default LoadingSpinner;
