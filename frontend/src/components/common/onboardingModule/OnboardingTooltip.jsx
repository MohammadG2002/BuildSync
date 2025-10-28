import CloseButton from "./CloseButton";
import CompletionContent from "./CompletionContent";
import StepProgress from "./StepProgress";
import StepContent from "./StepContent";
import StepNavigation from "./StepNavigation";

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
  <div
    className="fixed z-[102] bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in"
    style={tooltipStyle}
  >
    <CloseButton onClick={onSkip} />

    <div className="pr-6">
      {completed ? (
        <CompletionContent title={step.title} description={step.description} />
      ) : (
        <>
          <div className="mb-4">
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
