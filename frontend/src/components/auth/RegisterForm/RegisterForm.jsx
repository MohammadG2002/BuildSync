import { Link } from "react-router-dom";
import styles from "../../../pages/auth/Auth.module.css";
import NameRegister from "../inputs/register/NameRegister";

const RegisterForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  passwordStrength,
  loading,
  onSubmit,
}) => {
  const inputProps = { formData, setFormData, errors, setErrors };

  return (
    <form onSubmit={onSubmit} className={styles.authForm}>
      <h1 className={styles.title}>Get started absolutely free</h1>

      <NameRegister {...inputProps} />
      <EmailRegister {...inputProps} />
      <PasswordRegister {...inputProps} passwordStrength={passwordStrength} />
      <PasswordRepeat {...inputProps} />

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
        width="100%"
      >
        Continue
      </Button>

      <p className={styles.footer}>
        Already have an account?{" "}
        <Link to="/auth/login" className={styles.link}>
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
