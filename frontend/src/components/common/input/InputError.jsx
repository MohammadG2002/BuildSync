const InputError = ({ error }) => {
  if (!error) return null;

  return <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>;
};

export default InputError;
