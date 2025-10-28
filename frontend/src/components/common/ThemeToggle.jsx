import { useTheme } from "../../hooks/useTheme";
import { MoonIcon, SunIcon } from "./themeToggle/index";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      data-onboarding="theme-toggle"
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
