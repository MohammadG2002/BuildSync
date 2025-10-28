const InputLabel = ({ label }) => {
  if (!label) return null;

  return (
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
  );
};

export default InputLabel;
