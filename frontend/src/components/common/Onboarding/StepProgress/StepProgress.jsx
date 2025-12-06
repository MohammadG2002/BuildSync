import styles from "./StepProgress.module.css";

const StepProgress = ({ currentStep, totalSteps, steps }) => (
  <div className={styles.progressContainer}>
    <span className={styles.progressText}>
      Step {currentStep + 1} of {totalSteps}
    </span>
    <div className={styles.progressDots}>
      {steps.map((_, index) => {
        const dotClass = [
          styles.progressDot,
          index === currentStep && styles.progressDotCurrent,
          index < currentStep && styles.progressDotCompleted,
          index > currentStep && styles.progressDotUpcoming,
        ]
          .filter(Boolean)
          .join(" ");

        return <div key={index} className={dotClass} />;
      })}
    </div>
  </div>
);

export default StepProgress;
