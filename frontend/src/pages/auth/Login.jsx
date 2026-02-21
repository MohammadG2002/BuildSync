import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/button/Button/Button";
import handleSubmit from "../../utils/auth/handleSubmitLogin";
import styles from "./Auth.module.css";
import EmailLogin from "../../components/auth/inputs/login/EmailLogin";
import PasswordLogin from "../../components/auth/inputs/login/PasswordLogin";

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  return (
    <form
      onSubmit={(e) => handleSubmit(e, formData, setErrors, login, setLoading)}
      className={styles.authForm}
    >
      <h1 className={styles.title}>Welcome to BuildSync</h1>

      <EmailLogin
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />

      <PasswordLogin
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
      />

      <div className={styles.rememberRow}>
        <label className={styles.rememberLabel}>
          <input type="checkbox" className={styles.checkbox} />
          <span className={styles.rememberText}>Remember me</span>
        </label>
        <Link to="/auth/forgot-password" className={styles.link}>
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        width="100%"
        loading={loading}
        className={styles.fullWidthButton}
      >
        Sign In
      </Button>

      <p className={styles.footer}>
        Don't have an account?{" "}
        <Link to="/auth/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
