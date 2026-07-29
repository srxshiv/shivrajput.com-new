"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors duration-300 hover:text-foreground"
    >
      {mounted ? (
        resolvedTheme === "dark" ? (
          <Sun className="h-[16px] w-[16px]" strokeWidth={1.5} />
        ) : (
          <Moon className="h-[16px] w-[16px]" strokeWidth={1.5} />
        )
      ) : (
        <span className="h-[16px] w-[16px]" />
      )}
    </button>
  );
}
