import { CheckCircle } from "lucide-react";
import benefitsData from "../../../utils/landing/benefitsData";
import styles from "../../../pages/landing/LandingPage.module.css";

const BenefitsSection = () => {
  return (
    <section className={styles.benefits}>
      <div className={styles.benefitsContainer}>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitsContent}>
            <h2 className={styles.benefitsTitle}>
              Why teams choose {import.meta.env.VITE_APP_NAME || "ProjectHub"}
            </h2>
            <p className={styles.benefitsSubtitle}>
              Join thousands of teams who have transformed their project
              management workflow with our intuitive platform.
            </p>
            <div className={styles.benefitsList}>
              {benefitsData.map((benefit, index) => (
                <div key={index} className={styles.benefitItem}>
                  <CheckCircle className={styles.benefitIcon} />
                  <span className={styles.benefitText}>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.benefitsVisual}>
            <div className={styles.benefitsCard}>
              <div className={styles.benefitsCardHeader}>
                <div className={styles.benefitsCardAvatar}></div>
                <div>
                  <div className={styles.benefitsCardLine1}></div>
                  <div className={styles.benefitsCardLine2}></div>
                </div>
              </div>
              <div className={styles.benefitsCardBody}>
                <div className={styles.benefitsCardBodyLine}></div>
                <div
                  className={`${styles.benefitsCardBodyLine} ${styles.benefitsCardBodyLine2}`}
                ></div>
                <div
                  className={`${styles.benefitsCardBodyLine} ${styles.benefitsCardBodyLine3}`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
