import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="flex justify-between p-4 shadow-md">
      <h1 className="text-xl font-bold">useContext Demo</h1>
      <button onClick={toggleTheme} className="px-4 py-2 rounded-md border">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
