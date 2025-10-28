const InputIcon = ({ Icon }) => {
  if (!Icon) return null;

  return (
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
      <Icon className="w-5 h-5" />
    </div>
  );
};

export default InputIcon;
