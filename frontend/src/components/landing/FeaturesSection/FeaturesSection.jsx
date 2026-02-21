import FeatureCard from "./FeatureCard/FeatureCard";
import featuresData from "./featuresData";
import styles from "./FeaturesSection.module.css";

const FeaturesSection = () => {
  return (
    <section className={styles.features}>
      <h2 className={styles.featuresTitle}>Everything you need to succeed</h2>
      <p className={styles.featuresSubtitle}>
        Powerful features to help your team work better together
      </p>
      <div className={styles.featuresGrid}>
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
