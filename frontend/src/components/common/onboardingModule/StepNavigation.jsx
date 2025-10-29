import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import Button from "../Button";
import styles from "./Onboarding.module.css";

const StepNavigation = ({
  currentStep,
  totalSteps,
  onSkip,
  onPrevious,
  onNext,
}) => (
  <div className={styles.navigation}>
    <button onClick={onSkip} className={styles.skipButton}>
      Skip Tour
    </button>
    <div className={styles.navButtons}>
      {currentStep > 0 && (
        <Button variant="outline" size="sm" onClick={onPrevious}>
          <ChevronLeft className={styles.navIcon} />
          Previous
        </Button>
      )}
      <Button variant="primary" size="sm" onClick={onNext}>
        {currentStep === totalSteps - 1 ? (
          <>
            Finish
            <Check className={styles.navIcon} />
          </>
        ) : (
          <>
            Next
            <ChevronRight className={styles.navIcon} />
          </>
        )}
      </Button>
    </div>
  </div>
);

export default StepNavigation;
