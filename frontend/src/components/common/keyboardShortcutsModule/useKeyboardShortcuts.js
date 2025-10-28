// Custom hook to implement keyboard shortcuts globally
import { useEffect } from "react";

const useKeyboardShortcuts = (shortcuts, dependencies = []) => {
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

export default useKeyboardShortcuts;
