import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    const current = theme === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted p-1.5"
      aria-label="Cambiar tema"
      title="Cambiar tema"
    >
      {(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
        ? <Sun className="h-4 w-4" />
        : <Moon className="h-4 w-4" />
      }
    </button>
  );
}
