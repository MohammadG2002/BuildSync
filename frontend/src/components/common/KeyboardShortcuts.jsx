import { useState, useEffect } from "react";
import {
  shortcutsData,
  ShortcutsButton,
  ShortcutsModal,
} from "./keyboardShortcutsModule";

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.key === "?") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <ShortcutsButton onClick={() => setIsOpen(true)} />
      <ShortcutsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        shortcuts={shortcutsData}
      />
    </>
  );
};

export { useKeyboardShortcuts } from "./keyboardShortcutsModule";
export default KeyboardShortcuts;
