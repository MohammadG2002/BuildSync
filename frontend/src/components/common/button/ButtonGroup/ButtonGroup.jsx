import Button from "../Button";

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
