import { forwardRef } from "react";
import InputLabel from "./input/InputLabel";
import InputIcon from "./input/InputIcon";
import InputError from "./input/InputError";
import styles from "./input/Input.module.css";

const Input = forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    const inputClasses = [
      styles.input,
      Icon ? styles.inputWithIcon : "",
      error ? styles.inputError : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.inputContainer}>
        <InputLabel label={label} />
        <div className={styles.inputWrapper}>
          <InputIcon Icon={Icon} />
          <input ref={ref} className={inputClasses} {...props} />
        </div>
        <InputError error={error} />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
