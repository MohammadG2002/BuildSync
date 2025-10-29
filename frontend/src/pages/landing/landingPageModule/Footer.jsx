import styles from "../LandingPage.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <p className={styles.footerText}>
          © 2024 {import.meta.env.VITE_APP_NAME || "ProjectHub"}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
