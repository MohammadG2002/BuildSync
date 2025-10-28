import {
  Navigation,
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  CTASection,
  Footer,
} from "./landingPageModule";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
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
