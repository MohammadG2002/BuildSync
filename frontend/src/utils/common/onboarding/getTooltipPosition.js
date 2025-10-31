// Calculate tooltip position based on target element and position preference
const getTooltipPosition = (step) => {
  if (!step.target) return null;

  const element = document.querySelector(`[data-onboarding="${step.target}"]`);
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const position = {};

  switch (step.position) {
    case "bottom":
      position.top = rect.bottom + 16;
      position.left = rect.left + rect.width / 2;
      position.transform = "translateX(-50%)";
      break;
    case "top":
      position.bottom = window.innerHeight - rect.top + 16;
      position.left = rect.left + rect.width / 2;
      position.transform = "translateX(-50%)";
      break;
    case "right":
      position.top = rect.top + rect.height / 2;
      position.left = rect.right + 16;
      position.transform = "translateY(-50%)";
      break;
    case "left":
      position.top = rect.top + rect.height / 2;
      position.right = window.innerWidth - rect.left + 16;
      position.transform = "translateY(-50%)";
      break;
    default:
      position.top = "50%";
      position.left = "50%";
      position.transform = "translate(-50%, -50%)";
  }

  return position;
};

export default getTooltipPosition;
