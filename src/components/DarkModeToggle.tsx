import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DarkModeToggleProps {
  isScrolled?: boolean;
}

export function DarkModeToggle({ isScrolled = true }: DarkModeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="p-2 rounded-xl" aria-label="Toggle theme">
        <div className="w-5 h-5" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`p-2 rounded-xl transition-all duration-300 ${
        isScrolled
          ? "hover:bg-muted text-muted-foreground hover:text-foreground"
          : "hover:bg-secondary/10 text-secondary/70 hover:text-secondary"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  );
}
