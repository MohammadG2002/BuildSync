import FeatureCard from "./FeatureCard";
import featuresData from "./featuresData";
import styles from "../../pages/landing/LandingPage.module.css";

const FeaturesSection = () => {
  return (
    <section className={styles.features}>
      <div className={styles.featuresContainer}>
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>
            Everything you need to succeed
          </h2>
          <p className={styles.featuresSubtitle}>
            Powerful features to help your team work better together
          </p>
        </div>

        <div className={styles.featuresGrid}>
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
