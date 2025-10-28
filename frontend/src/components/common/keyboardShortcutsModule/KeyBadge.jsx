const KeyBadge = ({ keyText }) => (
  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
    {keyText}
  </kbd>
);

export default KeyBadge;
