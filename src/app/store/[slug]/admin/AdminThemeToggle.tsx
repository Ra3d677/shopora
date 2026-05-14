"use client";

import { Moon, Sun } from "lucide-react";
import { useAdminTheme } from "./AdminThemeProvider";

export default function AdminThemeToggle() {
  const { theme, toggleTheme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group overflow-hidden"
      style={{
        background: isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.05)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.1)",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(234,179,8,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Icons with smooth transition */}
      <div className="relative w-5 h-5">
        <Sun
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            color: isDark ? "#eab308" : "#94a3b8",
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.5)",
          }}
        />
        <Moon
          className="absolute inset-0 w-5 h-5 transition-all duration-500"
          style={{
            color: isDark ? "#94a3b8" : "#6366f1",
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)",
          }}
        />
      </div>
    </button>
  );
}
