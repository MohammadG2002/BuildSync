import { forwardRef } from "react";
import {
  getInputClassName,
  InputLabel,
  InputIcon,
  InputError,
} from "./input/index";

const Input = forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <InputLabel label={label} />
        <div className="relative">
          <InputIcon Icon={Icon} />
          <input
            ref={ref}
            className={getInputClassName(Icon, error, className)}
            {...props}
          />
        </div>
        <InputError error={error} />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
