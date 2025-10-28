import { Command } from "lucide-react";
import KeyBadge from "./KeyBadge";

const ShortcutSection = ({ section }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Command className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        {section.category}
      </h3>
      <div className="space-y-2">
        {section.items.map((item, itemIndex) => (
          <div
            key={itemIndex}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.description}
            </span>
            <div className="flex items-center gap-1">
              {item.keys.map((key, keyIndex) => (
                <span key={keyIndex} className="flex items-center gap-1">
                  <KeyBadge keyText={key} />
                  {keyIndex < item.keys.length - 1 && (
                    <span className="text-gray-400 dark:text-gray-600 text-xs">
                      +
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortcutSection;
