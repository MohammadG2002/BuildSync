import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../../../components/common/Button";
import styles from "../LandingPage.module.css";

const CTASection = () => {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle}>Ready to get started?</h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of teams already using{" "}
          {import.meta.env.VITE_APP_NAME || "ProjectHub"} to manage their
          projects.
        </p>
        <Link to="/register">
          <Button variant="secondary" size="lg" className="gap-2">
            Start Free Trial
            <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTASection;
