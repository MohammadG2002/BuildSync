import Button from "../Button";

/**
 * ButtonGroup - Container for grouped buttons
 * Usage:
 * <ButtonGroup>
 *   <Button>First</Button>
 *   <Button>Second</Button>
 *   <Button>Third</Button>
 * </ButtonGroup>
 */
const ButtonGroup = ({
  children,
  className = "",
  orientation = "horizontal",
}) => {
  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  return (
    <div
      className={`inline-flex ${orientationClasses[orientation]} ${className}`}
      role="group"
    >
      {children}
    </div>
  );
};

export default ButtonGroup;
