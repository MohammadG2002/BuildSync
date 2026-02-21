import { useState } from "react";
import handleChange from "../../../../utils/auth/handleChangeLogin";
import PasswordInput from "../../PasswordInput/PasswordInput";
import { Lock } from "lucide-react";

const PasswordLogin = ({ formData, setFormData, errors, setErrors }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <PasswordInput
      label="Password"
      name="password"
      placeholder="Enter your password"
      value={formData.password}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.password}
      icon={Lock}
      autoComplete="current-password"
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword(!showPassword)}
    />
  );
};

export default PasswordLogin;
