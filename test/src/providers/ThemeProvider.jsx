import { ThemeContext } from "@/context/context";
import { useEffect, useState } from "react";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark"; // default theme
    return localStorage.getItem("screen_mode") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("screen_mode", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/* <div  className={`${theme === 'dark' ? 'bg-darkerBlack' : 'white'}`}>
        {children}
      </div> */}
      <div>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
