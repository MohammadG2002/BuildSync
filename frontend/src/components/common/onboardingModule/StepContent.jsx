const StepContent = ({ title, description }) => (
  <>
    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </>
);

export default StepContent;
