import Navigation from "../../components/landing/Navigation/Navigation";
import HeroSection from "../../components/landing/HeroSection/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection/FeaturesSection";
import BenefitsSection from "../../components/landing/BenefitsSection/BenefitsSection";
import CTASection from "../../components/landing/CTASection/CTASection";
import Footer from "../../components/landing/Footer/Footer";
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
