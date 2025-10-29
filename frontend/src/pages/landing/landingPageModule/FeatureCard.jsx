import styles from "../LandingPage.module.css";

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className={styles.featureCard}>
      <div className={styles.featureIcon}>
        <Icon className={styles.featureIconInner} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </div>
  );
};

export default FeatureCard;
