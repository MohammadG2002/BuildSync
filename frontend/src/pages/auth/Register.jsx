import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getPasswordStrength } from "../../utils/validators";
import { AuthLayout, PasswordInput, FormDivider } from "../../components/auth";
import handleChange from "../../utils/auth/handleChangeRegister";
import handleSubmit from "../../utils/auth/handleSubmitRegister";
import styles from "../../components/auth/Auth.module.css";

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

  const passwordStrength = formData.password
    ? getPasswordStrength(formData.password)
    : null;

  return (
    <AuthLayout subtitle="Create your account">
      <form
        onSubmit={(e) =>
          handleSubmit(e, formData, setErrors, register, setLoading)
        }
        className={styles.authForm}
      >
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

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
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
          onChange={(e) => handleChange(e, setFormData, errors, setErrors)}
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
          className={styles.fullWidthButton}
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
