import CloseButton from "../CloseButton/CloseButton";
import CompletionContent from "../CompletionContent/CompletionContent";
import StepProgress from "../StepProgress/StepProgress";
import StepContent from "../StepContent/StepContent";
import StepNavigation from "../StepNavigation/StepNavigation";
import styles from "./OnboardingTooltip.module.css";

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
