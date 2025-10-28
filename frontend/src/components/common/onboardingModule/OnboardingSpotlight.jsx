import getSpotlightStyle from "./getSpotlightStyle";

const OnboardingSpotlight = ({ target }) => (
  <div
    className="fixed pointer-events-none z-[101]"
    style={{
      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
      ...getSpotlightStyle(target),
    }}
  />
);

export default OnboardingSpotlight;
