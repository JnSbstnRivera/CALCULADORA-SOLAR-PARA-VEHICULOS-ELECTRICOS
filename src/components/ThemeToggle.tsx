import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "wh-theme";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setSpinning(true);
    setTheme(next);
    applyTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setSpinning(false), 600);
  };

  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 p-1 pr-3 rounded-full border border-slate-200 dark:border-white/15 shadow-sm">
      <button
        type="button"
        onClick={toggle}
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        className={`p-1.5 rounded-full transition-all duration-500 ${
          spinning ? "rotate-[360deg]" : ""
        } ${
          isDark
            ? "bg-[#F89B24] text-white shadow-[0_0_10px_rgba(248,155,36,0.3)]"
            : "bg-[#1D429B] text-white shadow-[0_0_10px_rgba(29,66,155,0.2)]"
        }`}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <div className="flex flex-col items-start leading-none">
        <span className="text-[8px] font-black text-slate-400 dark:text-white/60 uppercase tracking-tighter">
          Tema
        </span>
        <span className={`text-[9px] font-black uppercase tracking-widest ${isDark ? "text-[#F89B24]" : "text-[#1D429B]"}`}>
          {isDark ? "Oscuro" : "Claro"}
        </span>
      </div>
    </div>
  );
}
