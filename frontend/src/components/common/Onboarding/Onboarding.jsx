import { useState, useEffect } from "react";
import {
  stepsData,
  getTooltipPosition,
  OnboardingBackdrop,
  OnboardingSpotlight,
  OnboardingTooltip,
} from ".";

const Onboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    localStorage.setItem("onboarding_completed", "true");
  };

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      setIsActive(false);
      localStorage.setItem("onboarding_completed", "true");
    }, 1500);
  };

  const step = stepsData[currentStep];

  const tooltipStyle = step.target
    ? getTooltipPosition(step)
    : {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  if (!isActive) return null;

  return (
    <>
      <OnboardingBackdrop />
      {step.target && <OnboardingSpotlight target={step.target} />}
      <OnboardingTooltip
        step={step}
        currentStep={currentStep}
        steps={stepsData}
        completed={completed}
        tooltipStyle={tooltipStyle}
        onSkip={handleSkip}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
};

export { restartOnboarding } from ".";
export default Onboarding;
