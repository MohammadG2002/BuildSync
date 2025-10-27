import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";
import Button from "./Button";

const Onboarding = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    if (!hasCompletedOnboarding) {
      // Show onboarding after a short delay
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  const steps = [
    {
      id: "welcome",
      title: "Welcome to BuildSync! 🎉",
      description:
        "Let's take a quick tour to help you get started with managing your projects efficiently.",
      target: null,
      position: "center",
    },
    {
      id: "workspaces",
      title: "Workspaces",
      description:
        "Switch between different workspaces to organize your projects. Click here to view all your workspaces.",
      target: "workspace-selector",
      position: "bottom",
    },
    {
      id: "search",
      title: "Global Search",
      description:
        "Quickly find projects, tasks, and members using Cmd/Ctrl + K",
      target: "global-search",
      position: "bottom",
    },
    {
      id: "notifications",
      title: "Notifications",
      description:
        "Stay updated with real-time notifications about tasks, mentions, and project updates.",
      target: "notification-bell",
      position: "bottom",
    },
    {
      id: "theme",
      title: "Dark Mode",
      description:
        "Toggle between light and dark themes for comfortable viewing at any time.",
      target: "theme-toggle",
      position: "bottom",
    },
    {
      id: "sidebar",
      title: "Navigation",
      description:
        "Access all your workspaces, projects, members, and settings from the sidebar.",
      target: "sidebar",
      position: "right",
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      description:
        "Press Shift + ? to view all available keyboard shortcuts and boost your productivity.",
      target: "shortcuts-button",
      position: "left",
    },
    {
      id: "complete",
      title: "You're All Set! 🚀",
      description:
        "You're ready to start managing your projects. You can restart this tour anytime from Settings.",
      target: null,
      position: "center",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  const handleRestart = () => {
    setCurrentStep(0);
    setCompleted(false);
    setIsActive(true);
  };

  const step = steps[currentStep];

  // Get target element position for tooltip
  const getTooltipPosition = () => {
    if (!step.target) return null;

    const element = document.querySelector(
      `[data-onboarding="${step.target}"]`
    );
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

  const tooltipStyle = step.target
    ? getTooltipPosition()
    : {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  if (!isActive) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[100] animate-fade-in" />

      {/* Highlight spotlight for current element */}
      {step.target && (
        <div
          className="fixed pointer-events-none z-[101]"
          style={{
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
            ...(() => {
              const element = document.querySelector(
                `[data-onboarding="${step.target}"]`
              );
              if (!element) return {};
              const rect = element.getBoundingClientRect();
              return {
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8,
                borderRadius: "8px",
              };
            })(),
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[102] bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in"
        style={tooltipStyle}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="pr-6">
          {completed ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    Step {currentStep + 1} of {steps.length}
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  Skip Tour
                </button>
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={handleNext}>
                    {currentStep === steps.length - 1 ? (
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Export restart function for use in settings
export const restartOnboarding = () => {
  localStorage.removeItem("onboarding_completed");
  window.location.reload();
};

export default Onboarding;
