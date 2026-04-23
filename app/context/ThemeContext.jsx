import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // Start with false (light) during SSR — no window access
  const [darkMode, setDarkMode] = useState(false);

  // After mount, read from localStorage / system preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("invoice-theme");
      if (stored !== null) {
        setDarkMode(stored === "dark");
        return;
      }
    } catch {}
    setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  // Apply .dark class to <html> and persist
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("invoice-theme", darkMode ? "dark" : "light");
    } catch {}
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleDarkMode: () => setDarkMode((d) => !d) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
