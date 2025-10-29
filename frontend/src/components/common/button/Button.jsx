import { memo } from "react";
import LoadingSpinner from "../button/LoadingSpinner";
import styles from "./Button.module.css";

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
  // Combine CSS module classes
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && <LoadingSpinner size={size} />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
};

export default memo(Button);
