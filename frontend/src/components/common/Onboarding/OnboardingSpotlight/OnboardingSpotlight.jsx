import getSpotlightStyle from "../../../../utils/common/onboarding/getSpotlightStyle";
import styles from "./OnboardingSpotlight.module.css";

const OnboardingSpotlight = ({ target }) => (
  <div className={styles.spotlight} style={getSpotlightStyle(target)} />
);

export default OnboardingSpotlight;
