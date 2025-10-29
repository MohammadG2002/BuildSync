import {
  Navigation,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  CTASection,
  Footer,
} from "./landingPageModule";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
