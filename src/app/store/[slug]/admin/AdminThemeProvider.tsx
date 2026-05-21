"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

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

  // Inject CSS variables based on theme
  const darkVars = {
    "--admin-bg": "#07080d",
    "--admin-sidebar-bg": "rgba(11,13,20,0.94)",
    "--admin-card-bg": "rgba(22,26,40,0.9)",
    "--admin-card-bg-solid": "#171c2a",
    "--admin-card-bg-darker": "#0f121e",
    "--admin-header-bg": "rgba(7,8,13,0.6)",
    "--admin-border": "rgba(255,255,255,0.07)",
    "--admin-border-hover": "rgba(255,255,255,0.14)",
    "--admin-text-primary": "#eef2f6",
    "--admin-text-secondary": "#94a3b8",
    "--admin-text-muted": "#4a5568",
    "--admin-input-bg": "rgba(255,255,255,0.04)",
    "--admin-glow-cyan": "rgba(6,182,212,0.2)",
    "--admin-glow-pink": "rgba(236,72,153,0.12)",
    "--admin-glow-purple": "rgba(139,92,246,0.12)",
    "--admin-nav-active-bg": "rgba(6,182,212,0.12)",
    "--admin-nav-hover-bg": "rgba(255,255,255,0.03)",
    "--admin-section-header": "#171c2a",
    "--admin-scrollbar-bg": "rgba(255,255,255,0.03)",
  };

  const lightVars = {
    "--admin-bg": "#f0f4f8",
    "--admin-sidebar-bg": "rgba(255,255,255,0.95)",
    "--admin-card-bg": "rgba(255,255,255,0.9)",
    "--admin-card-bg-solid": "#ffffff",
    "--admin-header-bg": "rgba(240,244,248,0.85)",
    "--admin-border": "rgba(0,0,0,0.07)",
    "--admin-border-hover": "rgba(0,0,0,0.12)",
    "--admin-text-primary": "#0f172a",
    "--admin-text-secondary": "#475569",
    "--admin-text-muted": "#94a3b8",
    "--admin-input-bg": "rgba(0,0,0,0.03)",
    "--admin-glow-cyan": "rgba(6,182,212,0.08)",
    "--admin-glow-pink": "rgba(236,72,153,0.08)",
    "--admin-nav-active-bg": "rgba(6,182,212,0.08)",
    "--admin-nav-hover-bg": "rgba(0,0,0,0.03)",
    "--admin-section-header": "rgba(255,255,255,1)",
    "--admin-scrollbar-bg": "rgba(0,0,0,0.04)",
  };

  const vars = theme === "dark" ? darkVars : lightVars;

  if (!mounted) {
    // Render with dark defaults to avoid flash
    return (
      <AdminThemeContext.Provider value={{ theme: "dark", toggleTheme }}>
        <div style={darkVars as React.CSSProperties} className="admin-theme-dark contents">
          {children}
        </div>
      </AdminThemeContext.Provider>
    );
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        style={vars as React.CSSProperties}
        className={`admin-theme-${theme} contents`}
        data-admin-theme={theme}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
