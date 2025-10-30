import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import assets from "../../assets/assets";
import styles from "./AuthLayout.module.css";

const AuthLayout = ({ children, title, subtitle }) => {
  const { isDark } = useTheme();

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ""}`}>
      <div className={styles.wrapper}>
        {/* Logo/Brand */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            <img
              src={assets.Logo}
              alt="BuildSync Logo"
              className={styles.logo}
            />
            {import.meta.env.VITE_APP_NAME || "BuildSync"}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>

        {/* Form Container */}
        <div className={styles.formContainer}>
          {title && <h2 className={styles.formTitle}>{title}</h2>}
          {children}
        </div>

        {/* Back to Landing */}
        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
