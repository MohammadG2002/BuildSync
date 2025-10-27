import { useState, useEffect } from "react";
import { X, Command, Search, Keyboard } from "lucide-react";
import Modal from "./Modal";

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Global keyboard shortcut to open the guide
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Shift + ? to open shortcuts guide
      if (event.shiftKey && event.key === "?") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["G", "D"], description: "Go to Dashboard" },
        { keys: ["G", "W"], description: "Go to Workspaces" },
        { keys: ["G", "M"], description: "Go to Members" },
        { keys: ["G", "S"], description: "Go to Settings" },
      ],
    },
    {
      category: "Search & Actions",
      items: [
        { keys: ["Ctrl/Cmd", "K"], description: "Open global search" },
        {
          keys: ["Ctrl/Cmd", "N"],
          description: "Create new (context-dependent)",
        },
        { keys: ["Ctrl/Cmd", "E"], description: "Edit selected item" },
        { keys: ["Ctrl/Cmd", "S"], description: "Save changes" },
        { keys: ["Esc"], description: "Close modal/dialog" },
      ],
    },
    {
      category: "Task Management",
      items: [
        { keys: ["T", "N"], description: "New task" },
        { keys: ["T", "C"], description: "Complete task" },
        { keys: ["T", "E"], description: "Edit task" },
        { keys: ["T", "D"], description: "Delete task" },
      ],
    },
    {
      category: "Lists & Navigation",
      items: [
        { keys: ["↑/↓"], description: "Navigate list items" },
        { keys: ["Enter"], description: "Open/Select item" },
        { keys: ["Tab"], description: "Next field" },
        { keys: ["Shift", "Tab"], description: "Previous field" },
      ],
    },
    {
      category: "General",
      items: [
        { keys: ["Shift", "?"], description: "Show this help" },
        { keys: ["Ctrl/Cmd", "\\\\"], description: "Toggle sidebar" },
        { keys: ["Ctrl/Cmd", "B"], description: "Toggle theme (dark/light)" },
      ],
    },
  ];

  const KeyBadge = ({ keyText }) => (
    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
      {keyText}
    </kbd>
  );

  return (
    <>
      {/* Floating Button to Open Shortcuts */}
      <button
        data-onboarding="shortcuts-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40 group"
        title="Keyboard Shortcuts (Shift + ?)"
      >
        <Keyboard className="w-6 h-6" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Shortcuts (Shift + ?)
        </span>
      </button>

      {/* Keyboard Shortcuts Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Keyboard Shortcuts"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use these keyboard shortcuts to navigate and perform actions quickly
            throughout the application.
          </p>

          {shortcuts.map((section, index) => (
            <div key={index} className="space-y-3">
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
                        <span
                          key={keyIndex}
                          className="flex items-center gap-1"
                        >
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
          ))}

          {/* Pro Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Pro Tips
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>
                • Most shortcuts work globally, even when not focused on an
                input
              </li>
              <li>
                • Press <KeyBadge keyText="Esc" /> to close any modal or cancel
                an action
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

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              Press <KeyBadge keyText="Esc" /> to close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Hook to implement keyboard shortcuts globally
export const useKeyboardShortcuts = (shortcuts, dependencies = []) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Skip if user is typing in an input
      if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
        return;
      }

      shortcuts.forEach(({ keys, action, ctrl, shift, alt, meta }) => {
        const keyMatch = keys.includes(event.key.toLowerCase());
        const ctrlMatch = ctrl === undefined || event.ctrlKey === ctrl;
        const shiftMatch = shift === undefined || event.shiftKey === shift;
        const altMatch = alt === undefined || event.altKey === alt;
        const metaMatch = meta === undefined || event.metaKey === meta;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          event.preventDefault();
          action(event);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, dependencies);
};

export default KeyboardShortcuts;
