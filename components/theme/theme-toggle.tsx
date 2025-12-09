"use client";

import { useTheme } from "@/components/theme/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Skipta í ljóst þema" : "Skipta í dökkt þema"}
      className="group flex h-9 w-16 items-center rounded-full border border-white/20 bg-white/5 px-1 backdrop-blur transition hover:border-white/40 hover:bg-white/10"
    >
      <span
        aria-hidden
        className={`inline-flex h-7 w-7 rounded-full bg-emerald-400/90 transition duration-200 ease-out group-hover:bg-emerald-300 ${
          isDark ? "translate-x-6" : ""
        }`}
      />
    </button>
  );
}
