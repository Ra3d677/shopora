"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type AdminTheme = "dark" | "light";

interface AdminThemeContextType {
  theme: AdminTheme;
  toggleTheme: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

const darkVars = {
  "--admin-bg": "#000000",
  "--admin-sidebar-bg": "rgba(10,10,14,0.97)",
  "--admin-card-bg": "rgba(15,15,22,0.85)",
  "--admin-card-bg-solid": "#0f0f16",
  "--admin-card-bg-darker": "#0a0a10",
  "--admin-header-bg": "rgba(0,0,0,0.75)",
  "--admin-border": "rgba(255,255,255,0.07)",
  "--admin-border-hover": "rgba(255,255,255,0.15)",
  "--admin-text-primary": "#ffffff",
  "--admin-text-secondary": "#a0a8b8",
  "--admin-text-muted": "#5a6270",
  "--admin-input-bg": "rgba(255,255,255,0.04)",
  "--admin-glow-cyan": "rgba(0,210,255,0.20)",
  "--admin-glow-pink": "rgba(255,50,126,0.12)",
  "--admin-glow-purple": "rgba(130,80,255,0.12)",
  "--admin-nav-active-bg": "rgba(0,210,255,0.10)",
  "--admin-nav-hover-bg": "rgba(255,255,255,0.03)",
  "--admin-section-header": "#0f0f16",
  "--admin-scrollbar-bg": "rgba(255,255,255,0.03)",
};

const lightVars = {
  "--admin-bg": "#ffffff",
  "--admin-sidebar-bg": "rgba(255,255,255,0.97)",
  "--admin-card-bg": "rgba(255,255,255,0.7)",
  "--admin-card-bg-solid": "#ffffff",
  "--admin-card-bg-darker": "#f5f6f8",
  "--admin-header-bg": "rgba(255,255,255,0.85)",
  "--admin-border": "rgba(0,0,0,0.06)",
  "--admin-border-hover": "rgba(0,0,0,0.12)",
  "--admin-text-primary": "#000000",
  "--admin-text-secondary": "#4a5260",
  "--admin-text-muted": "#9aa2b0",
  "--admin-input-bg": "rgba(0,0,0,0.02)",
  "--admin-glow-cyan": "rgba(0,210,255,0.06)",
  "--admin-glow-pink": "rgba(255,50,126,0.04)",
  "--admin-glow-purple": "rgba(130,80,255,0.04)",
  "--admin-nav-active-bg": "rgba(0,210,255,0.06)",
  "--admin-nav-hover-bg": "rgba(0,0,0,0.02)",
  "--admin-section-header": "rgba(255,255,255,1)",
  "--admin-scrollbar-bg": "rgba(0,0,0,0.02)",
};

export function AdminThemeProvider({
  children,
  slug,
}: {
  children: React.ReactNode;
  slug: string;
}) {
  const storageKey = `admin-theme-${slug}`;
  const [theme, setTheme] = useState<AdminTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as AdminTheme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    }
    setMounted(true);
  }, [storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: AdminTheme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const vars = useMemo(() => (theme === "dark" ? darkVars : lightVars), [theme]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.setAttribute('data-admin-theme', theme);
  }, [theme, vars, mounted]);

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
}
