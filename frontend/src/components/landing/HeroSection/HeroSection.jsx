import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../common/button/Button";
import styles from "../../../pages/landing/LandingPage.module.css";

const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <h1 className={styles.heroTitle}>
          Manage Projects with
          <span className={styles.heroHighlight}> Ease</span>
        </h1>
        <p className={styles.heroSubtitle}>
          The all-in-one project management platform that helps teams
          collaborate, organize, and deliver projects faster than ever before.
        </p>
        <div className={styles.heroActions}>
          <Link to="/register">
            <Button
              variant="primary"
              size="lg"
              className={styles.heroStartButton}
            >
              Start Free Trial
              <ArrowRight className={styles.heroStartIcon} />
            </Button>
          </Link>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
