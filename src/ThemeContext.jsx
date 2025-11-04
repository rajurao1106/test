import { createContext, useState } from "react";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      <div className={theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white min-h-screen"} >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
