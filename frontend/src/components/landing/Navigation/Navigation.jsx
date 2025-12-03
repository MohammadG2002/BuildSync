import { Link } from "react-router-dom";
import Button from "../../common/button/Button";
import styles from "../../../pages/landing/LandingPage.module.css";

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navContent}>
          <div className={styles.navBrand}>
            <h1 className={styles.navTitle}>
              {import.meta.env.VITE_APP_NAME || "ProjectHub"}
            </h1>
          </div>
          <div className={styles.navActions}>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
