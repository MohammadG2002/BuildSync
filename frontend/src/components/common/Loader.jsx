import { Loader2 } from "lucide-react";

const Loader = ({ size = "md", fullScreen = false }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const loader = (
    <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;
