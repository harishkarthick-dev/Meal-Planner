"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white dark:bg-stone-800 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-soft-sage",
        className,
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-soft-sage" />
    </button>
  );
}
