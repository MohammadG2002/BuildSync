import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import {
  AuthLayout,
  PasswordInput,
  FormDivider,
  validateLogin,
} from "./authModule";
import styles from "./authModule/Auth.module.css";

const Login = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const newErrors = validateLogin(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className={styles.authForm}>
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          autoComplete="current-password"
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <div className={styles.rememberRow}>
          <label className={styles.rememberLabel}>
            <input type="checkbox" className={styles.checkbox} />
            <span className={styles.rememberText}>Remember me</span>
          </label>
          <Link to="/forgot-password" className={styles.link}>
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
        >
          Sign In
        </Button>
      </form>

      <FormDivider />

      <p className={styles.footer}>
        Don't have an account?{" "}
        <Link to="/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
