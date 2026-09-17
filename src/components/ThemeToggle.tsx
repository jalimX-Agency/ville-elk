"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      storageKey="villa-elk-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function ThemeToggle({ labels }: { labels: { toDark: string; toLight: string } }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="fixed bottom-5 left-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-border bg-card/85 text-foreground shadow-[0_6px_24px_-12px_rgba(31,28,25,0.45)] backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-primary"
    >
      {/* Render a stable icon until mounted so server and client markup match */}
      {isDark ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />}
    </button>
  );
}
