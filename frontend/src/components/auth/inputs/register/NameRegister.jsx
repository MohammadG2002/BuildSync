import handleChange from "../../../../utils/auth/handleChangeRegister";
import { User } from "lucide-react";
import Input from "../../../common/input/Input/Input";

const NameRegister = ({ formData, setFormData, errors, setErrors }) => {
  return (
    <Input
      label="Full Name"
      type="text"
      name="name"
      placeholder="John Doe"
      value={formData.name}
      onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
      error={errors.name}
      icon={User}
      autoComplete="name"
    />
  );
};

export default NameRegister;
