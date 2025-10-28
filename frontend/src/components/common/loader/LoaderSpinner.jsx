import { Loader2 } from "lucide-react";

const LoaderSpinner = ({ size, sizes, text }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
      {text && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export default LoaderSpinner;
