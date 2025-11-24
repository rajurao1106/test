import React, { createContext, useContext, useState } from "react";

export const ThemeUser = createContext();   // <- MUST HAVE ()

export default function ThemeContext({ children }) {
 const [theme, setTheme] = useState(true)
 const themeHandel =()=>{
    setTheme((prev)=>!prev)
 }

  return (
    <ThemeUser.Provider value={{ themeHandel, theme }}>   {/* REQUIRED */}
      {children}
    </ThemeUser.Provider>
  );
}
