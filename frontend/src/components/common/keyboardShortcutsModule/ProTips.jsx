import KeyBadge from "./KeyBadge";

const ProTips = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
        💡 Pro Tips
      </h4>
      <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
        <li>
          • Most shortcuts work globally, even when not focused on an input
        </li>
        <li>
          • Press <KeyBadge keyText="Esc" /> to close any modal or cancel an
          action
        </li>
        <li>
          • Use <KeyBadge keyText="Tab" /> to navigate between form fields
          quickly
        </li>
        <li>
          • Combine shortcuts like <KeyBadge keyText="G" /> then{" "}
          <KeyBadge keyText="D" /> for quick navigation
        </li>
      </ul>
    </div>
  );
};

export default ProTips;
