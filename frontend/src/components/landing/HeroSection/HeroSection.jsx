import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./HeroSection.module.css";
import Button from "../../common/button/Button/Button";

const HeroSection = () => {
  return (
    <section className={styles.hero} id="hero">
      <h1 className={styles.heroTitle}>
        Manage Projects with
        <span className={styles.heroHighlight}> Ease</span>
      </h1>
      <p className={styles.heroSubtitle}>
        The all-in-one project management platform that helps teams collaborate,
        organize, and deliver projects faster than ever before.
      </p>
      <div className={styles.heroActions}>
        <Link to="/register">
          <Button variant="primary">
            Get Started <ArrowRight className={styles.arrowIcon} />
          </Button>
        </Link>
        <a href="/#demo">
          <Button variant="secondary">Watch Demo</Button>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
