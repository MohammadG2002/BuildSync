// Calculate spotlight highlight style for target element
const getSpotlightStyle = (target) => {
  const element = document.querySelector(`[data-onboarding="${target}"]`);
  if (!element) return {};

  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - 4,
    left: rect.left - 4,
    width: rect.width + 8,
    height: rect.height + 8,
    borderRadius: "8px",
  };
};

export default getSpotlightStyle;
