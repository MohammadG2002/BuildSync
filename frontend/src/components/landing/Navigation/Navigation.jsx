import { Link } from "react-router-dom";
import Button from "../../common/button/Button/Button";
import styles from "./Navigation.module.css";
import Logo from "../../../assets/logo.svg?react ";

const Navigation = () => (
  <nav className={styles.nav}>
    <h1 className={styles.brand}>
      <Logo className={styles.logo} />
      {import.meta.env.VITE_APP_NAME || "BuildSync"}
    </h1>
    <div className={styles.actions}>
      <Link to="/auth/login">
        <Button variant="ghost">Sign In</Button>
      </Link>
      <Link to="/auth/register">
        <Button variant="primary">Get Started</Button>
      </Link>
    </div>
  </nav>
);

export default Navigation;
