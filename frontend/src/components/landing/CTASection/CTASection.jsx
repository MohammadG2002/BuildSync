import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../common/button/Button/Button";
import styles from "./CTASection.module.css";

const CTASection = () => {
  return (
    <section className={styles.cta}>
      <h2 className={styles.ctaTitle}>Ready to get started?</h2>
      <p className={styles.ctaSubtitle}>
        Join thousands of teams already using{" "}
        {import.meta.env.VITE_APP_NAME || "BuildSync"} to manage their projects.
      </p>
      <Link to="/register" className={styles.ctaButton}>
        <Button variant="secondary" size="lg">
          Start for Free
          <ArrowRight className={styles.arrowIcon} />
        </Button>
      </Link>
    </section>
  );
};

export default CTASection;
