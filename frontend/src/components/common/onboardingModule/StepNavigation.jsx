import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Button from "../Button";

const StepNavigation = ({
  currentStep,
  totalSteps,
  onSkip,
  onPrevious,
  onNext,
}) => (
  <div className="flex items-center justify-between gap-3">
    <button
      onClick={onSkip}
      className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
    >
      Skip Tour
    </button>
    <div className="flex gap-2">
      {currentStep > 0 && (
        <Button variant="outline" size="sm" onClick={onPrevious}>
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
      )}
      <Button variant="primary" size="sm" onClick={onNext}>
        {currentStep === totalSteps - 1 ? (
          <>
            Finish
            <Check className="w-4 h-4" />
          </>
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  </div>
);

export default StepNavigation;
