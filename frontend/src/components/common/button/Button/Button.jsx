import React from "react";
import styles from "./Button.module.css";
import { getFontSize } from "./sizeMap";

const Button = ({ children, size = 20, variant = "primary" }) => {
  return (
    <button
      className={`${styles.btn} ${styles[`btn-${variant}`]}`}
      style={{ fontSize: getFontSize(size) }}
    >
      {children}
    </button>
  );
};

export default Button;
