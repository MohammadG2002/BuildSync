import { useTheme } from "../../../../hooks/useTheme";
import MoonIcon from "../MoonIcon/MoonIcon";
import SunIcon from "../SunIcon/SunIcon";
import styles from "./ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      data-onboarding="theme-toggle"
      onClick={toggleTheme}
      className={styles.button}
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};

export default ThemeToggle;
