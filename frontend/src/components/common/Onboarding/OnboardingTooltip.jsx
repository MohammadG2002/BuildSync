import CloseButton from "./CloseButton";
import CompletionContent from "./CompletionContent";
import StepProgress from "./StepProgress";
import StepContent from "./StepContent";
import StepNavigation from "./StepNavigation";
import styles from "./Onboarding.module.css";

const OnboardingTooltip = ({
  step,
  currentStep,
  steps,
  completed,
  tooltipStyle,
  onSkip,
  onPrevious,
  onNext,
}) => (
  <div className={styles.tooltip} style={tooltipStyle}>
    <CloseButton onClick={onSkip} />

    <div className={styles.tooltipContent}>
      {completed ? (
        <CompletionContent title={step.title} description={step.description} />
      ) : (
        <>
          <div className={styles.tooltipContentInner}>
            <StepProgress
              currentStep={currentStep}
              totalSteps={steps.length}
              steps={steps}
            />
            <StepContent title={step.title} description={step.description} />
          </div>

          <StepNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onSkip={onSkip}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </>
      )}
    </div>
  </div>
);

export default OnboardingTooltip;
