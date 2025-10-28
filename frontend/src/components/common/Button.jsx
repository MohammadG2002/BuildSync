import { memo } from "react";
import { getButtonClassName } from "./button/buttonStyles";
import LoadingSpinner from "./button/LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  icon,
  iconPosition = "left",
  fullWidth = false,
  ...props
}) => {
  const buttonClassName = getButtonClassName(variant, size, className);
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${buttonClassName} ${widthClass}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoadingSpinner size={size} />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default memo(Button);
