import { Link, Outlet } from "react-router-dom";
import Logo from "../../../assets/logo.svg?react";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <h1 className={styles.title}>
          <Logo className={styles.logo} />
          {import.meta.env.VITE_APP_NAME || "BuildSync"}
        </h1>
        <p className={styles.subtitle}>REAL-TIME PROJECT MANAGEMENT</p>
      </div>

      <div className={styles.formContainer}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
