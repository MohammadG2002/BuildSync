import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getPasswordStrength } from "../../utils/validators";
import {
  AuthLayout,
  PasswordInput,
  FormDivider,
  validateRegister,
} from "./authModule";
import styles from "./authModule/Auth.module.css";

const Register = () => {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateRegister(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

  return (
    <AuthLayout subtitle="Create your account">
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={User}
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          autoComplete="new-password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          showStrength={true}
          passwordStrength={passwordStrength}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={Lock}
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <div className={styles.termsRow}>
          <input type="checkbox" required className={styles.termsCheckbox} />
          <label className={styles.termsText}>
            I agree to the{" "}
            <a href="#" className={styles.link}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={styles.link}>
              Privacy Policy
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <FormDivider />

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link to="/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
