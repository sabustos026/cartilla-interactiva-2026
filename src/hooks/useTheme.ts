import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("cartilla-theme") as Theme) || "system";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const resolved = theme === "system" ? getSystemTheme() : theme;
    root.classList.toggle("dark", resolved === "dark");
    localStorage.setItem("cartilla-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
