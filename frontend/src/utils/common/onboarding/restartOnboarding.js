// Restart onboarding tour (for use in settings)
const restartOnboarding = () => {
  localStorage.removeItem("onboarding_completed");
  window.location.reload();
};

export default restartOnboarding;
