const StepProgress = ({ currentStep, totalSteps, steps }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
      Step {currentStep + 1} of {totalSteps}
    </span>
    <div className="flex gap-1">
      {steps.map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full transition-colors ${
            index === currentStep
              ? "bg-primary-600 dark:bg-primary-400"
              : index < currentStep
              ? "bg-primary-300 dark:bg-primary-600"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        />
      ))}
    </div>
  </div>
);

export default StepProgress;
