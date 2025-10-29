import getSpotlightStyle from "./getSpotlightStyle";
import styles from "./Onboarding.module.css";

const OnboardingSpotlight = ({ target }) => (
  <div className={styles.spotlight} style={getSpotlightStyle(target)} />
);

export default OnboardingSpotlight;
