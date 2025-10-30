import Button from "../Button";
import { Plus } from "lucide-react";
import styles from "./IconButton.module.css";

const IconButton = ({
  icon,
  "aria-label": ariaLabel,
  variant = "ghost",
  size = "md",
  ...props
}) => {
  if (!ariaLabel) {
    console.warn("IconButton should have an aria-label for accessibility");
  }

  return (
    <Button
      variant={variant}
      size={size}
      aria-label={ariaLabel}
      className={styles.iconButton}
      {...props}
    >
      {icon}
    </Button>
  );
};

export default IconButton;
