import { Mail } from "lucide-react";
import handleChange from "../../../../utils/auth/handleChangeLogin";
import Input from "../../../common/input/Input/Input";

const EmailLogin = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <Input
      label="Email"
      type="email"
      name="email"
      placeholder="you@example.com"
      value={formData.email}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.email}
      icon={Mail}
      autoComplete="email"
    />
  );
};

export default EmailLogin;
