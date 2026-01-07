import { useContext, createContext, useState } from "react";

type ThemeContextProvider = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeConctext = createContext<ThemeContextProvider | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  function toggleTheme() {
    setIsDark((prev) => !prev);
  }

  return (
    <ThemeConctext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeConctext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeConctext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
export { ThemeProvider, useTheme };
