import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  return (
    <button
      onClick={handleToggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-dark-4 transition-colors duration-300 ml-2"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <FaMoon className="text-dark-1" /> : <FaSun />}
    </button>
  );
};

export default ThemeToggleButton;
// This component is a simple theme toggle button that switches between dark and light modes.
